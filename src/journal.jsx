import { useState } from 'react';
import "./journal.css"
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Loginscreen from './login';


function Journal ({entryC}) {

        var [entries,setEntries] = useState([]);
        var [text, setText] = useState("");

        const addEntry = async(text) => {
            try {
                const docred = await addDoc(collection(db, "entries"), {
                    text: text,
                    createdAt: serverTimestamp

                });
            } catch(error) {
                console.log(error);
            }
        }
    
    
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry: #{entryC}</h2>
                <label>

                <textarea className = "entries" rows={10} cols={55} value = {text} onChange = {(e) => setText(e.target.value) }></textarea>

                </label>
            <p>You have {entryC} journal entries, keep going</p>
            
            <button style = {{backgroundColor: "grey"}} 
            // button for saving entries and creation of id for a number 
            onClick = { () => 
                {
                   addEntry(text);
                   setEntries([...entries,{ text, id: entryC}]);
                   setText("");

                }
            }
            >Save Entry</button>
           
        </div>
        
    )
}

export default Journal;
