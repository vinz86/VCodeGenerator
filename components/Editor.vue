<script setup>
import { ref, watch } from 'vue';
import DraggableComponent from '~/components/DraggableComponent.vue';
import ComponentOptions from '~/components/ComponentOptions.vue';

const components = ref([]);
const selectedComponent = ref(null);
const keyEditor = ref(0);
const keyOptions = ref(0);
const draggedComponentIndex = ref(null);
const draggedFrom = ref(null);
const dragOverIndex = ref(null);
const isPreviewVisible = ref(false);

const onDrop = (event) => {
  event.preventDefault();
  const dropTarget = event.target.dataset.dropTarget;
  const componentData = JSON.parse(event.dataTransfer.getData('component'));

  if (componentData.fromEditor) return;

  if (dropTarget === 'editor') {
    addComponent(componentData, components.value);
  }
};

const onDragOver = (event) => {
  event.preventDefault();
};

const onDragStart = (index) => {
  draggedComponentIndex.value = index;
  draggedFrom.value = 'index';
  event.dataTransfer.setData('component', JSON.stringify({fromEditor: true, ...components.value[index]}));
};

const onDragEnter = (index) => {
  dragOverIndex.value = index;
};

const onDragLeave = () => {
  dragOverIndex.value = null;
};

const onDropComponent = (index) => {
  if (draggedComponentIndex.value !== null) {
    const draggedItem = components.value.splice(draggedComponentIndex.value, 1)[0];

    if (index !== null) {
      components.value.splice(index, 0, draggedItem);
    } else {
      const insertIndex = Math.min(index, draggedComponentIndex.value);
      components.value.splice(insertIndex, 0, draggedItem);
    }

    draggedComponentIndex.value = null;
    dragOverIndex.value = null;
  }
};

const addComponent = (component, targetComponents) => {
  if (Array.isArray(targetComponents)) {
    const newComponent = { ...component, id: Date.now(), slot: [] };
    targetComponents.push(newComponent);
  } else {
    console.error('targetComponents non è un array', targetComponents);
  }
};

const addInDroppableComponent = (value, component) => {
  const index = components.value.findIndex(c => c.id === component.id);
  if (index !== -1 && components.value[index]) {
    components.value[index].slot = value;
  }
  console.log('components', components.value);
};


const updateComponent = (updatedProps) => {
  const index = components.value.findIndex(c => c.id === selectedComponent.value.id);
  if (index !== -1) {
    components.value[index].props = updatedProps;
    selectedComponent.value.props = updatedProps;
    keyEditor.value++;
  }
};

const handleComponentClick = (component) => {
  selectedComponent.value = component;
  keyOptions.value = keyOptions.value + 1;
};

const generatedCode = ref('');

const generateCodeRecursive = (component) => {
  let code = '';

  if (component.tag) {
    code += `<${component.tag} `;
  } else {
    return code;
  }

  if (component.props && component.props.id && component.props.id.trim() !== '') {
    code += `id="${component.props.id}" `;
  }

  if (component.props && component.props.class && component.props.class.trim() !== '') {
    code += `class="${component.props.class}" `;
  }

  if (component.props && component.props.attrs) {
    for (const key in component.props.attrs) {
      code += `${key}="${component.props.attrs[key]}" `;
    }
  }


  if(component.props.text || (component.slot && component.slot.length>0)){

    code += '>\n';

    if (component.props.text) {
      code += component.props.text;
    }

    if (component.slot && component.slot.length > 0) {
      code += processSlotContent(component.slot);
    }

    code += `\n</${component.tag}>\n`;

  } else {
    code += '/>\n';
  }

  return code;
};

const processSlotContent = (slotContent) => {
  let slotCode = '';

  if (Array.isArray(slotContent)) {
    for (const nestedComponent of slotContent) {
      slotCode += generateCodeRecursive(nestedComponent);
    }
  } else {
    slotCode += slotContent;
  }

  return slotCode;
};

const updateGeneratedCode = () => {
  if (!components.value.length) return;

  let generatedCodeValue = '';

  for (const component of components.value) {
    generatedCodeValue += generateCodeRecursive(component);
  }

  generatedCode.value = generatedCodeValue;
};

const removeComponent = (index) => {
  components.value.splice(index, 1);
};

const updateNestedComponents = (id, nestedComponents) => {
  const updateComponents = (componentsArray) => {
    for (const component of componentsArray) {
      if (component.id === id) {
        component.slot = nestedComponents;
        return componentsArray;
      }
      if (component.slot && component.slot.length > 0) {
        updateComponents(component.slot);
      }
    }
  };
  updateComponents(components.value)
};

const exportHTML = () => {
  if (!generatedCode.value || generatedCode.value?.length===0) return;

  let _ncode = `<template>\n${generatedCode.value}\n</template>`;
  const blob = new Blob([_ncode], { type: 'text/html' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'export.html';
  a.click();
  window.URL.revokeObjectURL(url);
};

const exportProject = () => {
  if (!Array.isArray(components.value) && components.value?.length===0) return;

  const jsonData = JSON.stringify(components.value);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'project.json';
  a.click();
  window.URL.revokeObjectURL(url);
};


const importProject = (event) => {
  const file = event.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedComponents = JSON.parse(e.target.result);
      components.value = importedComponents;
      console.log('Progetto importato:', importedComponents);
    } catch (error) {
      console.error('Errore durante il parsing del JSON:', error);
    }
  };
  reader.readAsText(file);
  debugger
};


watch(components, () => {
  updateGeneratedCode();
}, {deep: true});
</script>

<template>
  <div class="container">

    <Sidebar v-model:visible="isPreviewVisible" style="width:90%" header="Preview">
      <div v-html="generatedCode" />
    </Sidebar>

    <Splitter class="w-full m-0" layout="horizontal">
      <SplitterPanel size="20">
         <div class="flex flex-column m-2 h-full">
            <div class="flex-grow-1">
              <DraggableComponent/>
            </div>
           <div class="flex-none">
             <Button text class="w-full" @click="isPreviewVisible = true" severity="success"><i class="fa fa-search" />&nbsp;Preview</Button>
           </div>
           <div class="flex-none">
             <Button outlined @click="exportHTML" severity="dark" class="w-full"><i class="fa fa-download" />&nbsp;Download HTML</Button>
           </div>
           <div class="flex-none separator" />
            <div class="flex-none">
              <Button text @click="exportProject" severity="warning"><i class="fa fa-file-export" />&nbsp;Esporta progetto</Button>
            </div>
           <div class="flex-none mb-2">
             <FileUpload class="p-button-text" mode="basic" accept="application/json" :maxFileSize="1000000" @select="importProject($event)" :auto="true" chooseLabel="Importa progetto">
               <template #uploadicon> <i class="fa fa-file-import" />&nbsp; </template>
             </FileUpload>
           </div>
          </div>
      </SplitterPanel>
      <SplitterPanel size="60">

        <Splitter class="w-full" layout="vertical">
          <SplitterPanel size="75">
            <div class="editor" :key="keyEditor" @click="selectedComponent=null">
              <div
                  class="drop-area"
                  @drop="onDrop"
                  @dragover="onDragOver"
                  data-drop-target="editor"
              >
                <div
                    v-for="(component, index) in components"
                    :key="`${component.id}-${component.name}`"
                    :class="{'selectedComponent': selectedComponent?.id === component.id, [component.props.class]: component.props.class.length>0}"
                    class="draggable-component"
                    @drop="onDropComponent(index)"
                >
                  <component
                      v-model:selectedComponent="selectedComponent"
                      :is="component.name"
                      :componentId="component.id"
                      v-bind="component.props"
                      :parentComponents="component.slot"
                      @updateSelectedComponent="handleComponentClick"
                      @updateNestedComponents="updateNestedComponents"
                  />
                  <div class="component-icons">
                    <i class="fa-solid fa-trash-alt delete-icon component-icon" @click.stop="removeComponent(index)"/>
                    <i class="fa-solid fa-pencil edit-icon component-icon" @click.stop="handleComponentClick(component)"/>
                    <i class="fa-solid fa-arrows-up-down-left-right drag-icon component-icon"
                       draggable="true"
                       @dragstart="onDragStart(index)"
                       @dragenter="onDragEnter(index)"
                       @dragleave="onDragLeave()"
                    />
                  </div>
                </div>
              </div>
            </div>
          </SplitterPanel>
          <SplitterPanel size="25">
            <Panel class="h-full overflow-y-auto" header="Codice generato" toggleable>
              <pre class="generated-code w-full text-sm">{{generatedCode}}</pre>
            </Panel>
          </SplitterPanel>
        </Splitter>


      </SplitterPanel>
      <SplitterPanel size="20">
        <div class="m-2">
          <ComponentOptions
              v-if="selectedComponent"
              v-model="selectedComponent"
              @update:model-value="updateComponent"
          />
        </div>
      </SplitterPanel>
    </Splitter>
  </div>
</template>

<style scoped>

</style>