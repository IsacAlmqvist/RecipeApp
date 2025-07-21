import { useState } from "react";

export default function IngredientForm({onAddData, includeAmount = false, initialName = ''}) {

    const [form, setForm] = useState({
        name: initialName || '',
        unit: 'g',
        category: 'kolonial',
        cals: '',
        amount: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm( prev => ({...prev, [name]: value}))
    }

    const handleSubmit = (entry) => {
        entry.preventDefault();

        if(!form.name || !form.unit) {
            console.log("saknas namn eller enhet");
            return;
        }

        onAddData(form);

        setForm({name: '', unit: 'g', cals: '', amount: ''})
    }

    return (
        <form 
            onSubmit={handleSubmit} 
            style={{ width: '90%', margin: '0 auto'}} className=""
        >
            <div className="mb-4">
                <label htmlFor="ingredientName" className="form-label">
                    Namn
                </label>
                <input
                    id="ingredientName"
                    name="name"
                    type="text"
                    className="form-control"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="t.ex. Tomat"
                />
            </div>
            <div className="mb-4">
                <label htmlFor="unit" className="form-label">
                    Enhet
                </label>
                <select 
                    id="unit"
                    name="unit"
                    className="form-select" 
                    value={form.unit} 
                    onChange={handleChange}
                >
                    <option value="g">g</option>
                    <option value="st">st</option>
                    <option value="ml">ml</option>
                    <option value="dl">dl</option>
                    <option value="msk">msk</option>
                    <option value="tsk">tsk</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="category" className="form-label">
                    Avdelning
                </label>
                <select 
                    id="category"
                    name="category"
                    className="form-select" 
                    value={form.category} 
                    onChange={handleChange}
                >
                    <option value="kolonial">Kolonial</option>
                    <option value="frukt och grönt">Frukt och grönt</option>
                    <option value="kött och chark">Kött och chark</option>
                    <option value="mejeri">Mejeri</option>
                    <option value="bröd">Bröd</option>
                    <option value="frys">Frys</option>
                    <option value="övrigt">Övrigt</option>
                </select>
            </div>
            <div className="mb-4">
                <label htmlFor="cals" className="form-label">
                    Kalorier/100g
                </label>
                <input
                    id="cals"
                    name="cals"
                    type="number"
                    className="form-control"
                    value={form.cals}
                    onChange={handleChange}
                    placeholder="t.ex. 280"
                />
            </div>

            {includeAmount && 
            <div className="mb-4">
                <label htmlFor="amount" className="form-label">
                    Mängd
                </label>
                <div className="input-group">
                    <input
                        id="amount"
                        name="amount"
                        type="number"
                        className="form-control"
                        value={form.amount}
                        onChange={handleChange}
                    />
                    <span className="input-group-text">
                        {form.unit || ""}
                    </span>
                </div>
            </div> }

            <button type="submit" className="btn btn-primary">Lägg till</button>

        </form>
    );
}