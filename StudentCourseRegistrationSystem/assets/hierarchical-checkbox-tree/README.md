# Hierarchical checkboxes

jQuery for hierarchical checkboxes

## DEMO

[CodeSandbox](https://vceg4.csb.app/demo.html)

### USAGE:

Include 'hierarchical-checkboxes.js'
Include 'hierarchical-checkboxes.css'

All the HTML elements with class hierarchy-checkboxes will be parsed into the hierarchical checkboxes.
You will need to add an identifier in rel attribute to distinguish between different sets of checkboxes.

Template Construction:
Use ROOT template and then nest as many NODE templates to create your hierarchy

#### Root:

```HTML
<div class="hierarchy-checkboxes" rel="test">
  <input class="hierarchy-root-checkbox" type="checkbox">
  <label class="hierarchy-root-label">Root</label>
  <div class="hierarchy-root-child hierarchy-node">
   {{ NODE TEMPLATE HERE }}
  </div>
</div>
```

#### Node:

```HTML
<div class="hierarchy-node [leaf]">
  <input class="hierarchy-checkbox" type="checkbox">
  <label class="hierarchy-label">[Title]</label>
  {{ NODE TEMPLATE HERE }}
</div>
```

### Basic Example Template

```html
<div class="hierarchy-checkboxes" rel="test">
  <input class="hierarchy-root-checkbox" type="checkbox" />
  <label class="hierarchy-root-label">Root</label>
  <div class="hierarchy-root-child hierarchy-node">
    <div class="hierarchy-node leaf">
      <input class="hierarchy-checkbox" type="checkbox" />
      <label class="hierarchy-label">Markets</label>
      <div class="hierarchy-node leaf">
        <input class="hierarchy-checkbox" type="checkbox" />
        <label class="hierarchy-label">Markets</label>
      </div>
    </div>
    <div class="hierarchy-node leaf">
      <input class="hierarchy-checkbox" type="checkbox" />
      <label class="hierarchy-label">Markets</label>
    </div>
  </div>
</div>
```

### API:

#### Events:

##### 1. checkboxesUpdate:

Triggers whenever the check/uncheck tasks complete within the hierarchical checkboxes. This can be useful especially when you need to do some task only after all the states of the checkboxes are updated.

Example:

```javascript
jQuery(".hierarchy-checkboxes[rel=IDENTIFIER]").on(
  "checkboxesUpdate",
  function () {
    console.log("Changed!");
  }
);
```
