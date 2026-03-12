import { useState } from 'react';
import "./journal.css"


function Journal ({entryC}) {

        const [entries,setEntries] = useState([]);
        const [text, setText] = useState("");
    
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry: #{entryC}</h2>
                <label>

                <textarea className = "entries" rows={10} cols={55} value = {text} onChange = {(e) => setText(e.target.value) }></textarea>

                </label>
            <p>You have {entryC} journal entries, keep going</p>
            
            <button style = {{backgroundColor: "grey"}} 
            // button for saving entries and creation of id for a number 
            // onClick {() => 
            //     {
                   

            //     }
            // }
            >Save Entry</button>
           

        </div>
    )
}

export default Journal;
