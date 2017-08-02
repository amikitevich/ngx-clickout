# ngx-clickout

## Installation

To install this library, run:

```bash
$ npm install ngx-clickout --save
```

## Consuming your library

Once you have published your library to npm, you can import your library in any Angular application by running:

```bash
$ npm install ngx-clickout
```

and then from your Angular `AppModule`:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { ClickOutModule } from 'ngx-clickout';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify your library as an import
    ClickOutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

Once your library is imported, you can use its components, directives and pipes in your Angular application:

```typescript
import { Component, ChangeDetectionStrategy} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  title = 'app works!';

  isVisible = false;

  onToggle() {
    this.isVisible = !this.isVisible;
  }
}


```

```xml
<!-- You can now use your library component in app.component.html -->
<h1 *ngIf="isVisible" [clickOut]="isVisible" (clickOutEvent)="onToggle()">
  {{title}}
</h1>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

# CHANGELOG

<a name="0.2.1"></a>
# [0.2.1] (2017-06-27)

### Bug Fixes
* fix exit full screen in safari by esc

<a name="1.0.0"></a>
# [1.0.0] (2017-06-27)
* remove rxjs, add angular event listeners.
* breaking change remove clickOutFilter input property

<a name="1.0.2"></a>
# [1.0.0] (2017-06-27)
* emit mouse or keyboard event in clieckOutEvent

## License

MIT © [Alexey Mikitevich](mailto:alekseymikitevich@gmail.com)
