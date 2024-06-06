#include <WiFiClientSecure.h>
#include <MQTT.h>        // https://github.com/256dpi/arduino-mqtt
#include <SPI.h>
#include <LoRa.h>        // https://github.com/sandeepmistry/arduino-LoRa

#define DEBUG   //If you comment this line, the DPRINT & DPRINTLN lines are defined as blank.

#ifdef DEBUG
   #define DBEGIN(x)      Serial.begin(x) 
   #define DPRINT(...)    Serial.print(_VA_ARGS_)     
   #define DPRINTLN(...)  Serial.println(_VA_ARGS_)
#else
   #define DBEGIN(x)
   #define DPRINT(...)     
   #define DPRINTLN(...)
#endif

////

const char ssid[] = "ssid";
const char pass[] = "password";

// HiveMQ Broker - Secure connection
//
// #define BROKER_ADDRESS "address"
// #define BROKER_PORT portno
// #define BROKER_USER "username"
// #define BROKER_PASSWORD "password"


/////

#define LORA_CS     5
#define LORA_RESET  14
#define LORA_IRQ    2


byte msgCount = 0;            // count of outgoing messages
byte localAddress = 0xCC;     // address of this device

//

WiFiClientSecure net;
MQTTClient mqttClient;


//
bool routeIncomingMessage = false;
String sourceDeviceAddress;
String sourceDeviceProperty;
String sourceValue;




void setup() {
  DBEGIN(115200);
  DPRINTLN("Start");


  // WiFi Initializations

  WiFi.begin(ssid, pass);

  DPRINT("Connecting to WiFi ...");
  while (WiFi.status() != WL_CONNECTED) {
    DPRINT(".");
    delay(1000);
  }
  DPRINTLN(" connected!");
  net.setInsecure();

  // MQTT Initializations

  mqttClient.begin(BROKER_ADDRESS, BROKER_PORT, net);
  mqttClient.setOptions(60, false, 500);
  mqttClient.setWill("LoRa/gateway", "Disconnected", true, LWMQTT_QOS1);

  connectToBroker();

  // Lora Initialization

  LoRa.setPins(LORA_CS, LORA_RESET, LORA_IRQ);
  
  // initialize radio at 868 MHz
  if (!LoRa.begin(868E6)) {
    DPRINTLN("LoRa init failed. Check your connections.");
    while (true)
      ;
  }

  DPRINTLN("LoRa init succeeded.");
  LoRa.setSyncWord(0xF3);

  LoRa.onReceive(onLoraReceive);
  LoRa.receive();  
}

void registerDevice(String address, String device_input_property) {
  String topic = "LoRa/" + address + "/" + device_input_property;
  mqttClient.subscribe(topic);
}

void connectToBroker() {

  DPRINT("Connecting to MQTT Broker ...");

  while (!mqttClient.connect("ESP32", BROKER_USER, BROKER_PASSWORD)) {
    DPRINT("MQTT Client Disconnected! ");
    DPRINT(mqttClient.lastError()); DPRINTLN(" Return Code");
    DPRINTLN(mqttClient.returnCode());
    delay(1000);
  }

  DPRINTLN(" connected!");

  // Registration of each input property of each device
  registerDevice("ab", "S");

  // Last Will initialization
  mqttClient.publish("LoRa/gateway", "Ready", true, LWMQTT_QOS1);
}


void loop() {

  mqttClient.loop();

  if (routeIncomingMessage) {
    routeIncomingMessage = false;

    String topic = "LoRa/" + sourceDeviceAddress + "/" + sourceDeviceProperty;
    DPRINT("Sending Topic: ["); DPRINT(topic); DPRINT("] Payload: "); DPRINTLN(sourceValue);
    mqttClient.publish(topic, sourceValue, true, LWMQTT_QOS1);
  }


}


void onLoraReceive(int packetSize) {
  if (packetSize == 0) return;          // if there's no packet, return

  // read packet header bytes:
  int recipient = LoRa.read();          // recipient address
  byte sender = LoRa.read();            // sender address
  byte incomingMsgId = LoRa.read();     // incoming msg ID
  byte incomingLength = LoRa.read();    // incoming msg length

  String incoming = "";                 // payload of packet

  while (LoRa.available()) {            
    incoming += (char)LoRa.read();
  }

  if (incomingLength != incoming.length()) {   // check length for error
    DPRINTLN("error: message length does not match length");
    return;
  }

  // if the recipient isn't this gateway
  if (recipient != localAddress) {
    DPRINTLN("This message is not for me.");
    return;
  }

  // if message is for this device, or broadcast, print details:
  DPRINTLN("Received from: 0x" + String(sender, HEX));
  DPRINTLN("Sent to: 0x" + String(recipient, HEX));
  DPRINTLN("Message ID: " + String(incomingMsgId));
  DPRINTLN("Message length: " + String(incomingLength));
  DPRINTLN("Message: " + incoming);
  DPRINTLN("RSSI: " + String(LoRa.packetRssi()));
  DPRINTLN();

  while(routeIncomingMessage == true)
    ;

  char buf[sizeof(incoming)];
  incoming.toCharArray(buf, sizeof(buf));

  sourceDeviceProperty = strtok(buf, "=");
  sourceDeviceAddress = String(sender, HEX);
  sourceValue = strtok(NULL, "=");

  routeIncomingMessage = true;
}




void sendLoraMessage(byte device, String outgoing) {
  LoRa.beginPacket();                   // start packet
  LoRa.write(device);                   // add destination address
  LoRa.write(localAddress);             // add sender address
  LoRa.write(msgCount);                 // add message ID
  LoRa.write(outgoing.length());        // add payload length
  LoRa.print(outgoing);                 // add payload
  LoRa.endPacket();                     // finish packet and send it
  msgCount++;                           // increment message ID
}