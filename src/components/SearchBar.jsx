export default function SearchBar ({input, setInput}) {

    return (
        <form 
            style={{ width: '90%', margin: '0 auto'}}
        >
            <div>
                <input
                    name="search"
                    type="text"
                    className="form-control"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Sök"
                />
            </div>
        </form>
    );
}