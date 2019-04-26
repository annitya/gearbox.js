## Alternate Pane 

<!-- STORY -->

#### Usage:

```typescript jsx
import React from 'react';
import { AssetMeta } from '@cognite/gearbox';

function ExampleComponent(props) {
  return (
    <AssetMeta 
      assetId={4650652196144007}
      tab="events"
      hidePanels={['details']}
    />
  );
  
}
```