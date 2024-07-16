const axios = require("axios")
const  {Observable, forkJoin} = require("rxjs")
const {map, tap, catchError} = require("rxjs/operators")
const express = require("express")
const app = express();

const peopleAPIUrl="http://localhost:3000/api";
const policeAPIUrl="http://localhost:3001/api";
//const dni= '4376602';

/* CONSUMIENDO PEOPLE */
function fetchPeopleReactive(dni){
    console.log("fetchPeopleReactive");
    return new Observable( observer => {
        console.log("Solicitando people "+dni);
        axios.get(peopleAPIUrl+"/people/"+dni).then(response=>{
            observer.next(response.data);
            observer.complete();
        })
        .catch(e=>{ console.log("ERROR CON OBSERVABLE people");  observer.error(e) });
    });
}
/*fetchPeopleReactive().pipe(
    tap(data=>{
        console.log("datos PEOPLE recibidos de manera reactiva", data.data);
    }),
    catchError(e=>{
        console.log("Error al consumir PEOPLE datos", e);
        return [];
    })
).subscribe();*/

/* CONSUMIENDO POLICE */
function fetchPoliceReactive(dni){
    console.log("fetchPoliceReactive");
    return new Observable( observer => {
        console.log("Solicitando police "+dni);
        axios.get(policeAPIUrl+"/police/"+dni).then(response=>{
            observer.next(response.data);
            observer.complete();
        })
        .catch(e=>{ console.log("ERROR CON OBSERVABLE police"); observer.error(e) });
    });
}

/*fetchPoliceReactive().pipe(
    tap(data=>{
        console.log("datos POLICE recibidos de manera reactiva", data.data);
    }),
    catchError(e=>{
        console.log("Error al consumir POLICE datos", e);
        return [];
    })
).subscribe();*/

app.get("/api/combined/:dni", (req,res)=>{
    const dni = req.params.dni;
    console.log("LLEGO");
    forkJoin( { 
        people: fetchPeopleReactive(dni),
        police: fetchPoliceReactive(dni)
    }).pipe(
        tap(results =>{
            console.log("RESULTS", results);
            return {
                person:results.people,
                police:results.police
            }
        }),
        catchError(error=>{
            console.error(error);
            res.status(500).json( {e:'ERROR'} );
            return;
        })    
    ).subscribe(data=>{ res.json(data) })
})

app.listen(3002, ()=>{
    console.log("Iniciado");
})