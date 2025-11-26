// main.ts
import { Gridie } from "./gridie/gridie"

const container = document.querySelector<HTMLDivElement>('#app')!;

container.innerHTML = `
  <div>
    <h1>Ejemplo de Gridie</h1>
    <gridie-table id="myGrid"></gridie-table>
  </div>
`;


const consumidores =  consumidoresServices()
//mapr

// Pasar datos programáticamente (más limpio)
const grid = document.querySelector<Gridie>('#myGrid')!;
// grid.setData({

//  //headers: ["ID", "Nombre", "Email", "Rol", "Acciones"],
//   headers:[
//     {
//       field:"nombre"
//       filters:{
//         data: consumidores
        
//       }
//     }
//   ]
//   filters;{
//     ref: nombre
//   }
//   data: [
//     { id: 1, nombre: "Manuel García", email: "manuel@ejemplo.com", rol: "Developer" },
//     { id: 2, nombre: "Ana Martínez", email: "ana@ejemplo.com", rol: "Designer" },
//     { id: 3, nombre: "Carlos López", email: "carlos@ejemplo.com", rol: "Manager" }
//   ]
// });

const parametrosGRID = {
  headers:[
    {
      field:"Field 1",
      filters:{}// Configuracion de los filtros 

    }
  ] // Vamos a colocar las configuraciones del header
  // Vamos a enviar las 
}

console.log(parametrosGRID)