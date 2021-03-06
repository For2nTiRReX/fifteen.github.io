import {
    Injectable,
    Injector,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ApplicationRef,
    Renderer2
} from '@angular/core';

import { ChildConfig } from 'models/child-config';

@Injectable({
    providedIn: 'root',
})
export class DomService {

    renderer: Renderer2;
    private childComponentRef: any;
    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private appRef: ApplicationRef,
        private injector: Injector
    ) { }

    public appendComponentTo(parentId: string, child: any, childConfig?: ChildConfig) {
        // Create a component reference from the component
        const childComponentRef = this.componentFactoryResolver
            .resolveComponentFactory(child)
            .create(this.injector);

        // Attach the config to the child (inputs and outputs)
        this.attachConfig(childConfig, childComponentRef);

        this.childComponentRef = childComponentRef;
        // Attach component to the appRef so that it's inside the ng component tree
        this.appRef.attachView(childComponentRef.hostView);

        // Get DOM element from component
        const childDomElem = (childComponentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;


        // Append DOM element to the body
        const container = this.renderer.selectRootElement('#' + parentId );
        this.renderer.appendChild( container, childDomElem );
        //console.log(container, childDomElem);
    }

    public removeComponent() {
        this.appRef.detachView(this.childComponentRef.hostView);
        this.childComponentRef.destroy();
    }


    private attachConfig(config, componentRef) {
        let inputs = config.inputs;
        let outputs = config.outputs;
        for(var key in inputs){
            componentRef.instance[key] = inputs[key];
        }
        for(var key in outputs){
            componentRef.instance[key] = outputs[key];
        }
    }
}
