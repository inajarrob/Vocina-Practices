class Scene2 extends Phaser.Scene {
    constructor() {
        super("scene2");
    }

    preload() {
        
    }

    create() {
        console.log('Creando escena 2...')
        
        let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true, //Incluye los numeros de linea
            //theme: "ambiance",  //El tema de fondo
            lineWrapping: true, //Cuando acabas una linea salta a la siguiente
            //readOnly: true    //Modo de solo lectura
            undoDepth: 20 //Maximo numero de lineas en las que puedes escribir
        })
        editor.setValue("//¿Estás preparado?") //Valor que se muestra por defecto 
        
        //Crea botón en el área de canvas de la escena
        this.clickButton = this.add.text(10, 10, 'Run!', {
                fill: '#0f0'
            })
            .setInteractive()
            .on('pointerover', () => this.enterButtonHoverState())
            .on('pointerout', () => this.enterButtonRestState())
            .on('pointerdown', () => this.enterButtonActiveState())
            .on('pointerup', () => {
                let contenidoEditor = editor.getValue();
                this.readWritten(contenidoEditor);
                this.enterButtonHoverState();
        });
        console.log('Creada escena 2');
    }
    
    //Funcion que crea una funcion con el codigo pasado por parametros
    createFunction(codigo) {
            return new Function('this.sceneB.'+codigo);
    }
    
    //Lectura y 
    readWritten(editorContent) {
        //Parte de código en el que se llama a otra escena
        this.sceneB = this.scene.get('scene1');
        
        let executeMe = this.createFunction(editorContent);
        executeMe.call(this);
    }
    enterButtonHoverState() {
        this.clickButton.setStyle({
            fill: '#ff0'
        });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({
            fill: '#0f0'
        });
    }

    enterButtonActiveState() {
        this.clickButton.setStyle({
            fill: '#0ff'
        });
    }
}