import '../App.css';
import Green_can from '../images/green.png';
import Red_can from '../images/red.png';
import Yellow_can from '../images/yellow.png';
import 'leaflet/dist/leaflet.css';
import React,{ useState, useEffect } from 'react';
import useWebSocket from 'react-use-websocket';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer,Marker,Popup} from 'react-leaflet';

const Home = () => {


    const [data, setData] = useState({});
    const [reconnectAttempts, setReconnectAttempts] = useState(0);

    const { lastMessage, readyState } = useWebSocket('ws://localhost:8000/ws', {
        onOpen: () => {
            console.log('Connected to WebSocket');
            setReconnectAttempts(0);  // Reset reconnect attempts on successful connection
        },
        onClose: () => {
            console.log('Disconnected from WebSocket');
        },
        onError: (event) => {
            console.error('WebSocket error:', event);
        },
        shouldReconnect: (closeEvent) => {
            // Reconnect after 5 seconds
            setReconnectAttempts(prev => prev + 1);
            return true;
        },
        reconnectInterval: 1000  // Reconnect interval set to 5 seconds
    });

    const [finalValue,setFinalValue] = useState(null)

    useEffect(() => {
        if (lastMessage !== null) {
            setData(JSON.parse(lastMessage.data));
            const data = JSON.parse(lastMessage.data);
            console.log(lastMessage.data);
            const finalValue = data[data.length-1].value;
            setFinalValue(59)
        }
        

    }, [lastMessage]);

    console.log(finalValue);
    const Icon = L.icon({
        iconUrl: finalValue > 50 ? Green_can : finalValue < 20  ? Red_can : Yellow_can,
        iconSize: [50, 50]
    });




    






    const latitude = 10.9038;
    const longitude = 76.8984;
    const location = { id: 1, area: 'AB3', lat: 10.9038, lng: 76.8984 };
    return (
        <div>
            <div style={{ position:'sticky', top:'0', maxWidth:'100%', height:'5rem', backgroundColor: 'rgba(92, 178, 128,1)', display: 'flex' , justifyContent:'flex-end' ,zIndex:'999'}}>
                <div style = {{display: 'flex',paddingRight:'3rem', alignItems: 'center'} }>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/analysis" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Analysis</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/home" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Map</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/feedback" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Feedback</Link>
                    </div>
                    <button onClick={() => {localStorage.removeItem('token'); window.location.href = '/';}}   style={{ backgroundColor: 'rgba(159, 173, 210)', color: 'black', border: 'none', padding: '8px 10px', cursor: 'pointer', borderRadius: '10px', fontWeight: 'bold', fontFamily: 'Poppins' }} >Logout</button>
                </div>
            </div>
            <div>  
                <MapContainer center={[latitude, longitude]} zoom={16.3}>
                    <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker key={location.id} icon={Icon} position={location}>
                        <Popup>
                        ID: {location.id} <br />
                        Area: {location.area}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
                <div className="App">
                <h1>Real-Time Data from InfluxDB</h1>
                <pre>{JSON.stringify(data, null, 2)}</pre>
                </div>
        </div>
        
    );
};

export default Home;
