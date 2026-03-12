
import "./journal.css"
class entry  {
        constructor(numnum, tete){
            this.numnum = numnum;
            this.tete = tete;
        }
        
    };
function Journal ({entryC}) {

    
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry: #{entryC}</h2>
                <label>

                <textarea className = "entries" rows={10} cols={55}></textarea>

                </label>
            <p>You have {entryC} journal entries, keep going</p>
            <button style = {{backgroundColor: "grey"}} onClick {() => 
                {
                    var newentry = new entry(count, "");

                }
            }
            ></button></div>>Save Entry</button>

        </div>
    )
}

export default Journal;
