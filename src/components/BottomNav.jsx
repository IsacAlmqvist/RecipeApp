import { Link, useLocation } from 'react-router-dom';

export default function BottomNav({onHomeClick}) {
    const location = useLocation();
    const current = location.pathname;

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #ccc',
            display: 'flex', justifyContent: 'space-around', padding: '0.5rem',
            paddingBottom: '26px'
        }}>
            <Link to= "/" onClick={onHomeClick} style={{ fontweight: current === '/' ? 'bold' : 'normal'}}>Hem</Link>
            <Link to= "/addItem" style={{ fontweight: current === '/' ? 'bold' : 'normal'}}>Lägg till</Link>
            <Link to= "/shoppingList" style={{ fontweight: current === '/' ? 'bold' : 'normal'}}>Inköpslista</Link>
            <Link to= "/plannedFood" style={{ fontweight: current === '/' ? 'bold' : 'normal'}}>Planerad mat</Link>
        </nav>
    );
}