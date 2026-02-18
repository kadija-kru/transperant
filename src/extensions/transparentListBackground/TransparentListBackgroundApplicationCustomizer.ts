import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';

import * as strings from 'TransparentListBackgroundApplicationCustomizerStrings';

const LOG_SOURCE: string = 'TransparentListBackgroundApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ITransparentListBackgroundApplicationCustomizerProperties {
  // This is an example; replace with your own property
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class TransparentListBackgroundApplicationCustomizer
  extends BaseApplicationCustomizer<ITransparentListBackgroundApplicationCustomizerProperties> {

  @override
  public onInit(): Promise<void> {
    Log.info(LOG_SOURCE, `Initialized ${strings.Title}`);

    // Inject custom CSS to make list backgrounds transparent
    this._injectCustomStyles();

    return Promise.resolve();
  }

  private _injectCustomStyles(): void {
    try {
      // Create a style element
      const style: HTMLStyleElement = document.createElement('style');
      style.type = 'text/css';
      style.id = 'transparent-list-background-styles';

      // Define the custom CSS
      const css: string = `
        /* Make SharePoint list backgrounds transparent */
        .ms-List, 
        .ms-DetailsList,
        .ms-FocusZone,
        div[data-automationid="CanvasZone"] .ms-SPLegacyFabricBlock,
        .ms-CommandBar,
        .ms-DetailsRow {
          background-color: transparent !important;
        }

        /* Additional list container elements */
        .ms-List-page,
        .ms-List-cell,
        .ms-DetailsRow-fields,
        .ms-GroupHeader {
          background-color: transparent !important;
        }

        /* List view wrapper elements */
        .ms-FocusZone[data-focuszone-id],
        div[class*="listViewContainer"],
        div[class*="list-container"] {
          background-color: transparent !important;
        }
      `;

      // Append CSS to style element
      style.appendChild(document.createTextNode(css));

      // Append style element to document head
      if (document.head) {
        document.head.appendChild(style);
        Log.info(LOG_SOURCE, 'Custom transparent list background styles injected successfully');
      }
    } catch (error) {
      Log.error(LOG_SOURCE, new Error(`Error injecting custom styles: ${error}`));
    }
  }
}
