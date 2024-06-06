#include <SPI.h>
#include <LoRa.h>    // https://github.com/sandeepmistry/arduino-LoRa

#define DEBUG         //If you comment this line, the DPRINT & DPRINTLN lines are defined as blank.
const int pingPin = 27;

#define sensor 34

#ifdef DEBUG
#define DBEGIN(x)      Serial.begin(x)
#define DPRINT(...)    Serial.print(_VA_ARGS_)
#define DPRINTLN(...)  Serial.println(_VA_ARGS_)
#else
#define DBEGIN(x)
#define DPRINT(...)
#define DPRINTLN(...)
#endif

#define LORA_CS     5
#define LORA_RESET  14
#define LORA_IRQ    2


String outgoing;              // outgoing message
byte msgCount = 0;            // count of outgoing messages
byte localAddress = 0xAB;     // address of this device
byte destination  = 0xCC;     // gateway address

void setup() {
  DBEGIN(115200);

  DPRINTLN("LoRa Device");

  LoRa.setPins(LORA_CS, LORA_RESET, LORA_IRQ);

  // initialize radio at 868 MHz
  if (!LoRa.begin(868E6)) {
    DPRINTLN("LoRa init failed. Check your connections.");
    while (true)
      ;
  }
  LoRa.setSyncWord(0xF3);
  DPRINTLN("LoRa init succeeded.");
  DPRINTLN("Device Ready");
}

void loop() {


  
  long duration, inches, cm;

  // The PING))) is triggered by a HIGH pulse of 2 or more microseconds.
  // Give a short LOW pulse beforehand to ensure a clean HIGH pulse:
  pinMode(pingPin, OUTPUT);
  digitalWrite(pingPin, LOW);
  delayMicroseconds(2);
  digitalWrite(pingPin, HIGH);
  delayMicroseconds(5);
  digitalWrite(pingPin, LOW);

  // The same pin is used to read the signal from the PING))): a HIGH pulse
  // whose duration is the time (in microseconds) from the sending of the ping
  // to the reception of its echo off of an object.
  pinMode(pingPin, INPUT);
  duration = pulseIn(pingPin, HIGH);

  // convert the time into a distance
  inches = microsecondsToInches(duration);
  cm = microsecondsToCentimeters(duration);

  Serial.print(inches);
  Serial.print("in, ");
  Serial.print(cm);
  Serial.print("cm");
  Serial.println();

  Serial.print("Sending packet: ");

  sendLoRaMessage("cm",String(cm));
  sendLoRaMessage("inches",String(inches));
  Serial.println(msgCount);

  delay(1000);




}

void sendLoRaMessage(String property, String value) {
  String outgoing = property + "=" + value;
  LoRa.beginPacket();                   // start packet
  LoRa.write(destination);              // add destination address
  LoRa.write(localAddress);             // add sender address
  LoRa.write(msgCount);                 // add message ID
  LoRa.write(outgoing.length());        // add payload length
  LoRa.print(outgoing);                 // add payload
  LoRa.endPacket();                     // finish packet and send it
  msgCount++;                           // increment message ID
}

long microsecondsToInches(long microseconds) {
  // According to Parallax's datasheet for the PING))), there are 73.746
  // microseconds per inch (i.e. sound travels at 1130 feet per second).
  // This gives the distance travelled by the ping, outbound and return,
  // so we divide by 2 to get the distance of the obstacle.
  // See: https://www.parallax.com/package/ping-ultrasonic-distance-sensor-downloads/
  return microseconds / 74 / 2;
}

long microsecondsToCentimeters(long microseconds) {
  // The speed of sound is 340 m/s or 29 microseconds per centimeter.
  // The ping travels out and back, so to find the distance of the object we
  // take half of the distance travelled.
  return microseconds / 29 / 2;
}