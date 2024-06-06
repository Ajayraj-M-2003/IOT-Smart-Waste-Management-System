import "./style.css";
import { InfluxChart } from "./InfluxChart";
import { Link } from 'react-router-dom';

export default function App() {
    return (
        <div>
            <div style={{ position:'sticky',zIndex:99999, top:'0', maxWidth:'100%', height:'5rem', backgroundColor: 'rgba(92, 178, 128,1)', display: 'flex' , justifyContent:'flex-end' }}>
                <div style={{ display: 'flex', paddingRight:'3rem', alignItems: 'center' }}>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/analysis" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Analysis</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/home" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Map</Link>
                    </div>
                    <div style={{ marginRight: '10px', backgroundColor: 'rgba(130, 123, 193)', padding: '8px', borderRadius: '10px' }}>
                        <Link to="/feedback" style={{ color: 'black', textDecoration: 'none', fontWeight: 'bold', fontFamily: 'Poppins' }}>Feedback</Link>
                    </div>
                    <button onClick={() => {localStorage.removeItem('token'); window.location.href = '/';}} style={{ backgroundColor: 'rgba(159, 173, 210)', color: 'black', border: 'none', padding: '8px 10px', cursor: 'pointer', borderRadius: '10px', fontWeight: 'bold', fontFamily: 'Poppins' }}>Logout</button>
                </div>
            </div>
            <div className="App" style={{ height: '100vh',width:'100vw', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <InfluxChart />
            </div>
        </div>
    );
}
