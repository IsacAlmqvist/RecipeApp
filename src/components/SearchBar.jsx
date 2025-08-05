export default function SearchBar ({input, setInput}) {

    return (
        <form>
            <input
                name="search"
                type="text"
                className="form-control"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Sök"
                style={{width:'100%'}}
            />
        </form>
    );
}