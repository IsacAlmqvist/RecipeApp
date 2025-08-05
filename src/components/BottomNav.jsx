import { Link, useLocation } from 'react-router-dom';

export default function BottomNav({onHomeClick}) {
    const location = useLocation();
    const current = location.pathname;

    return (
        <nav style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            background: '#fff', borderTop: '1px solid #ccc',
            display: 'flex', justifyContent: 'space-around', padding: '0.5rem',
            paddingBottom: '32px'
        }}>
            <Link to= "/" onClick={onHomeClick}><i className='bi bi-house-door-fill fs-2'/></Link>
            <Link to= "/addItem" ><i className='bi bi-plus-lg fs-1'/></Link>
            <Link to= "/shoppingList"><i className='bi bi-cart3 fs-2'/></Link>
            <Link to= "/plannedFood" style={{paddingTop:'8px'}}><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-fork-knife" viewBox="0 0 16 16">
                        <path d="M13 .5c0-.276-.226-.506-.498-.465-1.703.257-2.94 2.012-3 8.462a.5.5 0 0 0 .498.5c.56.01 1 .13 1 1.003v5.5a.5.5 0 0 0 .5.5h1a.5.5 0 0 0 .5-.5zM4.25 0a.25.25 0 0 1 .25.25v5.122a.128.128 0 0 0 .256.006l.233-5.14A.25.25 0 0 1 5.24 0h.522a.25.25 0 0 1 .25.238l.233 5.14a.128.128 0 0 0 .256-.006V.25A.25.25 0 0 1 6.75 0h.29a.5.5 0 0 1 .498.458l.423 5.07a1.69 1.69 0 0 1-1.059 1.711l-.053.022a.92.92 0 0 0-.58.884L6.47 15a.971.971 0 1 1-1.942 0l.202-6.855a.92.92 0 0 0-.58-.884l-.053-.022a1.69 1.69 0 0 1-1.059-1.712L3.462.458A.5.5 0 0 1 3.96 0z"/>
                    </svg>
            </Link>
        </nav>
    );
}