<script setup lang="ts">
import {ProjectHelper} from "~/helper/ProjectHelper";
import type {TComponentAttributes} from "~/models/types/TComponentAttributes";
import type {IComponentFactory} from "~/models/interfaces/IComponentFactory";
import {DragDropHelper} from "~/helper/DragDropHelper";
import {nextTick, onMounted, onUnmounted, ref, type Ref} from "vue";
import type {TItemContextMenu} from "~/models/types/TItemContextMenu";
import {Api} from "~/services/api/Api";
import {ApiKeys} from "~/services/api/ApiKeys";
import type {IComponentService} from "~/services/api/services/interfaces/IComponentService";
import {DIContainer} from "~/DIContainer/DIContainer";
import {EServiceKeys} from "~/models/enum/EServiceKeys";
import type {ComponentFactory} from "~/models/interfaces/ComponentFactory";
import type {LocalStorageService} from "~/services/LocalStorageService";
import type {INotifyManager} from "~/models/interfaces/INotifyManager";
import {LoadingManager} from "~/manager/LoadingManager";
import type {TFile} from "~/models/types/TFile";
import type {TComponentOptions} from "~/models/types/TComponentOptions";
import {ComponentHelper} from "~/helper/ComponentHelper";
import DroppableComponent from "~/components/DraggableComponents/Layout/DroppableComponent.vue";
import {useAppStore} from "~/store/AppStore";
import {useUserStore} from "~/store/useUserStore";

const emit = defineEmits(['updateComponents']);
const props = defineProps({
  componentFactory:{
    required: true,
    type: Object as PropType<ComponentFactory>
  },
  parentId:{
    type: Number,
    default: null
  }
})
const componentFactory = ref(props.componentFactory);
const components = defineModel<IComponentFactory[]>('components');
const selectedComponent = defineModel<IComponentFactory>('selectedComponent');
const selectedProject = defineModel<IProject>('project');
const selectedFile = defineModel<TFile>('file');

const contextMenu = ref();

const draggedComponentIndex: Ref<number|null> = ref(null);
const draggedFrom: Ref<any> = ref(null);
const dragOverIndex: Ref<any> = ref(null);

const componentService: IComponentService = Api.getService<IComponentService>(ApiKeys.ComponentService);
const localStorageService = DIContainer.getService<LocalStorageService>(EServiceKeys.LocalStorageService);
const notifyManager = DIContainer.getService<INotifyManager>(EServiceKeys.NotifyManager);

// stores
const projectStore = useAppStore();

const itemsContextComponent: Ref<TItemContextMenu[]> = ref([
  {label: 'Modifica', icon: 'fa fa-pencil', command: () => handleComponentClick(selectedComponent.value as IComponentFactory)},
  {label: 'Duplica', icon: 'fa fa-copy', command: () => selectedComponent.value && duplicateComponent(selectedComponent.value)},
  {label: 'Cancella', icon: 'fa fa-trash', command: () => removeComponent()},
]);

//#
const addComponent = async (component: IComponentFactory, parentId: string = null, dropIndex?: number) => {
  try {
    LoadingManager.getInstance().start();
      const newFactoryComponent = componentFactory.value.createElement(component);
      newFactoryComponent.configure({
        ...component,
        type: newFactoryComponent?.constructor?.name || '',
        fileId: selectedFile.value?.id,
        order: dropIndex,
        parentId: parentId,
        user: {
          id: useUserStore().user.id,
          login: useUserStore().user.login
        }
      });

      const resultCreateComponent = await componentService.createComponent(newFactoryComponent?.options);
      if(resultCreateComponent?.id){
        newFactoryComponent.configure({id: resultCreateComponent.id});
      }

      components.value = !Array.isArray(components.value) ? [] : components.value;
      components.value?.splice(dropIndex, 0, newFactoryComponent);
      updateOrderForSiblings(components.value, parentId);

      await ComponentHelper.updateComponentsOrder(components.value)

      emit('updateComponents');
      selectedComponent.value = newFactoryComponent;
    }

  catch (e) { notifyManager.error(e?.message || e); }
  finally { LoadingManager.getInstance().stop(); }
};

const duplicateComponent = async (component: IComponentFactory) => {
  if (component) {

    await addComponent(component, component?.options?.parentId );
    //TODO devo duplicare tutti i componenti contenuti al suo interno
    const newComponentOptions: TComponentOptions = component?.options && JSON.parse(JSON.stringify(component?.options)) || {};
    newComponentOptions.className = (component?.options?.className || '').replace('selectedComponent', '');
    const newComponent: IComponentFactory = componentFactory.value.createElement(newComponentOptions);

    if(Object.keys(newComponent).length>0){
      components.value = [...components.value, newComponent];
      if (newComponent?.options?.slot?.options) {
        await duplicateComponent(newComponent.options.slot);
      }

    }
  }
};
const removeComponent = async (index?: string): Promise<boolean> => {
  try {
    LoadingManager.getInstance().start();


    if (!index) {
      index = components.value.findIndex(x => x.options.id === selectedComponent.value?.options?.id);
    }

    if (index >= 0) {
      const componentToRemove = components.value[index];
      const parentId = componentToRemove.options.parentId;

      components.value.splice(index, 1);
      await updateOrderForSiblings(components.value, parentId);


      await componentService.deleteComponent(componentToRemove.options.id);
      await ComponentHelper.updateComponentsOrder(components.value)

      emit('updateComponents');

      selectedComponent.value = {};
      return true;
    }
  } catch (e) {
    notifyManager.error(e);
    return false;
  } finally {
    LoadingManager.getInstance().stop();
  }
};

// TODO: da verificare
function updateOrderForSiblings(components: IComponentFactory[], parentId: string | null): void {
  // Filtra i componenti per il parentId passato come argomento
  const siblings = components.filter(component => component.options.parentId === parentId);

  // Ordina i sibling components in base all'ordine corrente
  siblings.sort((a, b) => a.options.order - b.options.order);

  // Aggiorna l'ordine dei componenti sequenzialmente, a partire da 1
  siblings.forEach((component, index) => {
    component.options.order = index + 1;
  });
}

const onDrop = (event: DragEvent, index: number) => {
  event.preventDefault();
  event.stopPropagation();

  if(!selectedProject.value) return;
  const dropTarget = event.target.closest('[data-drop-target]');
  const dropIndex = DragDropHelper.calculateDropIndex(event.clientX, event.clientY, dropTarget);
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && componentData?.trim() !== '' && JSON.parse(componentData);

  console.log('dropTarget:', dropTarget);
  console.log('dropTarget dataset:', dropTarget?.dataset);

  if (componentData.fromEditor) return;

  let draggedComponent;
  if (componentData.fromDroppableComponent) {
    if (componentData.parentComponentId) {
      const pathToComponent = DragDropHelper.findObjectById(components.value, componentData.parentComponentId);
      if (pathToComponent !== null) {
        if (componentData.component) {
          draggedComponent = componentData.component;
          DragDropHelper.removeObjectByPath(components.value, pathToComponent, componentData.index);
        }
      }
    } else {
      const pathToComponent = DragDropHelper.findObjectById(components.value, componentData.id);
      if (pathToComponent !== null) {
        draggedComponent = JSON.parse(JSON.stringify(DragDropHelper.removeObjectByPath(components.value, pathToComponent)));
      }
    }
  } else {
    draggedComponent = componentData?.slot ? componentData : componentData;
  }

  if (draggedComponent) {
    if (dropTarget && dropTarget.dataset.dropTarget === 'editor') {
      addComponent(draggedComponent, null, dropIndex);
    } else if (dropTarget && dropTarget.dataset.dropTarget === 'droppable') {
      const parentComponentId = dropTarget?.dataset?.componentId || dropTarget?.id;
      if (parentComponentId) {
        addComponent(draggedComponent, parentComponentId, dropIndex);
      }
    }

  }

};

const onDragStart = (event: any, index: number) => {
  let componentData = event.dataTransfer.getData('component');
  componentData = componentData && JSON.parse(componentData);
  if (!componentData.fromDroppableComponent) {
    draggedComponentIndex.value = index;
    draggedFrom.value = 'index';
    event.dataTransfer.setData('component', JSON.stringify({ fromEditor: true, ...components.value[index] }));
  }
};

const onDragEnter = (index: number) => dragOverIndex.value = index;

const onDragLeave = () => dragOverIndex.value = null;

const onDragOver = (event: any) => event.preventDefault();

const onDropComponent = (index: number) => {
  if (draggedComponentIndex.value !== null) {

    const draggedItem = components.value.splice(draggedComponentIndex.value, 1)[0];
    if (index) {
      components.value.splice(index, 0, draggedItem);
    } else {
      const insertIndex = Math.min(index, draggedComponentIndex.value);
      components.value.splice(insertIndex, 0, draggedItem);
    }
    draggedComponentIndex.value = null;
    dragOverIndex.value = null;
  }
};


const removeDraggedComponent = (event: any) => {
  if (!event) return;

  const cmpId = event?.options?.parentComponentId ? event?.options?.parentComponentId : event?.options?.id;
  const index = event.draggedIndex;
  const pathToComponent = DragDropHelper.findObjectById(components.value, cmpId?.toString() || Date.now());
  if (pathToComponent !== null) {
    if (event?.options?.parentComponentId && index >= 0) {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent, index);
    } else {
      DragDropHelper.removeObjectByPath(components.value, pathToComponent)
    }
  }
};

const updateNestedComponents = (id: string, nestedComponents: IComponentFactory[]) => {
  const updateComponents = (componentsArray: IComponentFactory[]) => {
    for (const component of componentsArray) {
      if (component?.options?.id?.toString() === id) {
        component.options.slot = nestedComponents;
        return componentsArray;
      }
      if (component?.options?.slot !== undefined) {
        updateComponents(component.options.slot);
      }
    }
  };
  updateComponents(components.value);
};

const handleComponentClick = async (component: IComponentFactory) => {
  selectedComponent.value = component;
  projectStore.setComponent(component)
};

const handleComponentRightClick = (event: any, component: IComponentFactory) => {
  contextMenu.value.hide();
  nextTick(() => {
    selectedComponent.value = component;
    projectStore.setComponent(component)
    contextMenu.value.show(event);
  });
};

const getComponentAttributes = (component) => {
  const baseAttributes = ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {};

  if (isDroppableComponent(component)) {
    return {
      ...baseAttributes,
      file: selectedFile,
      component: component,
      componentFactory: componentFactory,
      children: component.options?.slot,
    };
  }

  return baseAttributes;
};

const isDroppableComponent = (component) => {
  return component.options?.type === 'DroppableComponent';
};


onMounted(async () => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Delete') {
      event.preventDefault();
      removeComponent();
    }
  };

  window.addEventListener('keydown', handleKeyDown);

  onUnmounted(() => {
    window.removeEventListener('keydown', handleKeyDown);
  });
});


const render = (component: IComponentFactory) => {
  if (component) {
    return component.render(component.options.tag, {
      //...component.options.attributes,
      id: component.options?.id,
      class: component.options?.className,
      style: component.options?.style,
    });
  } else {
    return null;
  }
};
</script>

<template>
  <div
      class="drop-area"
      :class="props.parentId ? 'droppable-area' : 'editor-area'"
      :data-drop-target="props.parentId ? 'droppable': 'editor'"
      :data-component-id="props.parentId ? props.parentId : 'editor'"
       @drop="onDrop"
       @dragover="onDragOver"
  >
    <ContextMenu ref="contextMenu" :model="itemsContextComponent" />

    <div
        v-for="(component, index) in components"
        :key="`${component?.options?.id}-${index}`"
        draggable="true"
        class="draggable-component"
        :class="{'selectedComponent': selectedComponent?.options?.id === component?.options?.id}"
        @drop="onDropComponent(index)"
        @dragstart="!component?.options?.locked ? onDragStart($event, index) : ''"
        @dragenter="onDragEnter(index)"
        @dragleave="onDragLeave()"
        @contextmenu.stop="handleComponentClick(component); handleComponentRightClick($event);"
    >

<!--      <component
          v-model:selectedComponent="selectedComponent"
          :is="component.render(component?.options?.attributes, component.options.inner)" />-->

      <template v-if="component.options.name==='DroppableComponent'">
        <DroppableComponent
            :is="component.render()"
            v-model:selected-component="selectedComponent"
            :class="{[component?.options?.class]: component?.options?.class?.length}"
            :style="component?.options?.style"
            :component="component"
            :component-factory="componentFactory"
            :file="selectedFile"
            :children="component.options?.slot"
            v-bind="ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {}"
            @update-components="emit('updateComponents', $event)"
            @click.stop="handleComponentClick(component)"
            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
            @remove-component="removeDraggedComponent($event)"
        >{{ component.options?.inner }}</DroppableComponent>


      </template>
      <template v-else>
        <component
            :is="component.render()"
            v-model:selected-component="selectedComponent"
            :class="{[component?.options?.class]: component?.options?.class?.length}"
            :style="component?.options?.style"
            :component-id="component?.options?.id"
            v-bind="ProjectHelper.getBindAttributes(component.options as TComponentAttributes) || {}"
            @update-components="emit('updateComponents', $event)"
            @click.stop="handleComponentClick(component)"
            @contextmenu.stop="!component?.options?.locked ? handleComponentRightClick($event, component): ''"
            @remove-component="removeDraggedComponent($event)"
        />
      </template>

    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>