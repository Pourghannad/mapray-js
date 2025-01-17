import Module from "./Module";

import Option, { DomTool } from "../Option";



export default class Dataset3dModule extends Module {

    private _init_option: Dataset3dModule.Option;

    private _ui?: HTMLElement;


    constructor( option: Dataset3dModule.Option = {} ) {
        super( "3D Dataset" );
        this._init_option = option;
    }


    protected override async doLoadData(): Promise<void>
    {
        if ( this._init_option.datasets ) {
            for ( const dataset of this._init_option.datasets ) {
                await this.debugViewer.addModelEntity( dataset );
            }
        }
    }


    override getDebugUI(): HTMLElement
    {
        if ( this._ui ) {
            return this._ui;
        }

        const ui = this._ui = super.getDebugUI();

        const Entity3D_RENDER_OPTION_PROPERTIES = [
            {
                key: "visibility",
                type: "boolean",
                description: "表示",
                value: true,
            },
        ];
        const option = new Option( Entity3D_RENDER_OPTION_PROPERTIES );
        const top2 = document.createElement("div");
        top2.setAttribute("class", "top");
        top2.appendChild(DomTool.createCheckboxOption(option, "visibility"));

        ui.appendChild( top2 );

        // Register Handler for the properties
        option.onChange("visibility", event => {
            if ( this.debugViewer.model3DList ) {
                this.debugViewer.model3DList.forEach( entity => {
                    entity.setVisibility( event.value );
                });
            }
        });

        return ui;
    }

}



namespace Dataset3dModule {



export interface Option {
    datasets?: string[];
}



}
