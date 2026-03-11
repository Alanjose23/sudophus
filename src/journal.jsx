import React from 'react';

function Journal ({entryc}) {
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry</h2>
                <p>Journal entries go here</p>


            <p>You have {entryc} journal entries, keep going</p>
        </div>
    )
}

export default Journal;