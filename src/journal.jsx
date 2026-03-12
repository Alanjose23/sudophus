
import "./journal.css"

function Journal ({entryC}) {
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry: #{entryC}</h2>
                <label>

                <textarea className = "entries" rows={10} cols={55}></textarea>

                </label>
            <p>You have {entryC} journal entries, keep going</p>
            <button style = {{backgroundColor: "grey"}}>Save Entry</button>

        </div>
    )
}

export default Journal;