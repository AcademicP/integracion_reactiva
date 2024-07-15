const express = require("express")
const  {observable, from} = require("rxjs")
const {map, filter} = require("rxjs/operators")

const app = express()
const port = 3000

const data = [
    {id:1, dni:4376601, name:"Llerena"},
    {id:2, dni:4376602, name:"Cardenas"},
    {id:3, dni:4376603, name:"Valles"},
]

app.get("/api/people/:dni", (req, res)=>{
    let processData = [];
    const observable = from(data);
    observable.pipe(
        filter(e=>e.dni==req.params.dni),
        map( user => ({id:user.id, dni:user.dni, name:user.name, processed:true}) )
    )
    .subscribe({
        next:value=>{ processData.push(value) },
        complete:()=>{ res.json(processData) }
    })
});

app.listen(port, ()=>{
    console.log("Listen in "+port);
});