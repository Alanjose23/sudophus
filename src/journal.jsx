import React from 'react';

function Journal ({count}) {
    return (
        <div style = {{textAlign:  'center'}}>
            <h2>Journal entry</h2>
                <p>Journal entries go here</p>


            <p>You have {count} journal entries, keep going</p>
        </div>
    )
}

export default Journal;