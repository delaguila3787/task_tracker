import fs from 'node:fs'
const comando = process.argv[2];
const listado = [];
const posibilidades = ["add", "update", "delete", "list", "mark-done", "mark-in-progress","help"];

//! CLAUSULAS DE SEGURIDAD
if( !posibilidades.includes(comando) ){
    console.log(`El comando ${comando} no existe, puede ejecutar los siguientes comandos:
        [${posibilidades[0]}] - requiere (string),
        [${posibilidades[1]}] - requiere (id(numerico)),
        [${posibilidades[2]}] - requiere (id(numerico)), 
        [${posibilidades[3]}] - opcional (null: todos, done, in-progress), 
        [${posibilidades[4]}] - requiere (id(numerico)), 
        [${posibilidades[5]}] - requiere (id(numerico)),
        [${posibilidades[6]}] -`
    )
    Error()
} 
//if( posibilidades.includes(comando) && comando != "list" && process.argv[3] === undefined) throw new Error("mal comando")


const cargaInicial = () => {
    const carpeta = fs.readdirSync("../Task_Tracker")
    
     if( carpeta.includes("BD-task.json") ){

        const tareas = fs.readFileSync("../Task_Tracker/BD-task.json",{encoding: "utf-8"})

        if( tareas != " " && tareas != ""){

            for (const tarea of JSON.parse(tareas)) {
                listado.push(tarea)
            }
            return listado
        }
        
         
     }
    
}

const guardar = () => {
    fs.writeFileSync("../Task_Tracker/BD-task.json", JSON.stringify(listado))
}

const buscar = () => {
    
    

    switch (process.argv[3]) {
        case undefined:
            if( listado.length < 1){
                console.log("no tiene ninguna tarea grabada en la memoria")
                return
            }
            const listadoF = listado.filter( (tarea) => !tarea.deleted)
            console.log(listadoF)
            break;
        case "in-progress":
            const listadoFiltrado = listado.filter( (tarea) => tarea.status == "in-progress")
            if( listadoFiltrado.length < 1){
                console.log("no hay elementos que coincidan con la busqueda")
                return
            }
            console.log(listadoFiltrado)
            break;
        case "done":
            const listadoFiltrado2 = listado.filter( (tarea) => tarea.status == "done")
            if( listadoFiltrado2.length < 1){
                console.log("no hay elementos que coincidan con la busqueda")
                return
            }
            console.log(listadoFiltrado2)
            break;
    }

    
}

const crear = () => {
    const tarea = {
        id: new Date().getTime(),
        description: process.argv.slice(3).join(" "),
        status: "in-progress",
        createdAt: new Date().toLocaleDateString(),
        updatedAt: "",
        deleted: false
    }

    listado.push(tarea);

    console.log(`se creó la tarea exitosamente (ID:${tarea.id})`)
    guardar();
}

const modificar  = ( command ) => {
    
    for (const tarea of listado) {
        if( tarea.id == process.argv[3]){

            switch (command) {

                case "mark-done":
                    tarea.status = "done"
                    tarea.updatedAt = new Date().toLocaleDateString()
                    console.log(`la tarea (ID:${tarea.id}) se marcó como finalizada`)
                    break;
                case "mark-in-progress":
                    tarea.status = "in-progress"
                    tarea.updatedAt = new Date().toLocaleDateString()
                    console.log(`la tarea (ID:${tarea.id}) se marcó como "en progreso"`)
                    break;
                case "delete":
                    tarea.deleted = true
                    console.log(`la tarea (ID:${tarea.id}) ha sido borrada`)
                    break;
                case "update":
                    tarea.description = process.argv.slice(4).join(" ")
                    tarea.updatedAt = new Date().toLocaleDateString()
                    console.log(`la tarea (ID:${tarea.id}) ha sido modificada`)
                    break;
            }

        }
        continue
    }

    guardar()
}

const mostrarAyuda = () => {
    console.log(`
        [${posibilidades[0]}] - requiere (string) - agrega una nueva tarea,
        [${posibilidades[1]}] - requiere (id(numerico)) - modifica una tarea especifica,
        [${posibilidades[2]}] - requiere (id(numerico)) - borra una tarea especifica, 
        [${posibilidades[3]}] - opcional (null: todos, done, in-progress) - lista todas las tareas, lista las tareas "done", lista las tareas "in-progress", 
        [${posibilidades[4]}] - requiere (id(numerico)) - cambia el status de una tarea a "done", 
        [${posibilidades[5]}] - requiere (id(numerico)) - cambia el status de una tarea a "in-progress",
        [${posibilidades[6]}] - muestra el listado de opciones
        `)
}

cargaInicial()

switch (comando) {
    case "add":
        crear()
        break;
    case "list":
        buscar()
        break;
    case "help":
        mostrarAyuda()
        break;
    default:
        modificar(comando)
        break;
}


