export default function Modal({children, onClose}) {
    return (
        <div className="shadow rounded"
            style={{
            position: "fixed",
            top: 260, left: 0, right: 0, bottom: 160,
            backgroundColor: "rgb(230, 230, 230)",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            width: "94%",
            margin: "0 auto"

        }} >
            <button style={{display: "block", marginLeft: "auto", marginRight: "6px", marginTop: "6px"}} className="btn btn-secondary" onClick={onClose}>
                x
            </button>
            {children}
        </div>
    );
}