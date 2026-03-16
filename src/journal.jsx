import { useState } from 'react';
import "./journal.css"
import { db } from "./firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";



function Journal ({entryC}) {

        let [entries,setEntries] = useState([]);
        let [text, setText] = useState("");

        const addEntry = async(text) => {
            try {
                const docred = await addDoc(collection(db, "entries"), {
                    text: text,
                    createdAt: serverTimestamp()

                });
                console.log("Document written with ID:", docred.id);
                return docred.id;
            } catch(error) {
                console.log(error);
            }
        }
    
    
    return (
        <div style = {{textalign:  'center'}}>
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
