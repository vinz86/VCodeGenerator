<script setup>
import { ref, watch, defineProps } from 'vue';

const props = defineProps({
  parentComponents: {
    type: Array,
    required: false,
    default: () => []
  },
  attrs: {
    type: Object,
  },
  componentId: {
    type: Number,
    required: true,
  }
});
const emit = defineEmits(['updateNestedComponents']);
const components = ref([]);
const selectedComponent = ref();
const draggedComponentIndex = ref(null);
const dragOverIndex = ref(null);

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (event) => {
  event.preventDefault();
  event.stopPropagation();

  const dropTarget = event.target.dataset.dropTarget;
  const componentData = JSON.parse(event.dataTransfer.getData('component'));

  if (componentData.fromDroppableComponent) return;

  if (dropTarget === 'droppable') {
    addComponent(componentData, components.value);
  }
};

const addComponent = (component, targetComponents) => {
  if (Array.isArray(targetComponents)) {
    const newComponent = { ...component, id: Date.now(), slot: [] };
    targetComponents.push(newComponent);
  } else {
    console.error('targetComponents is not an array', targetComponents);
  }
};

const onDragStart = (index) => {
  draggedComponentIndex.value = index;
  event.dataTransfer.setData('component', JSON.stringify({fromDroppableComponent: true, ...components.value[index]}));
};

const onDragEnter = (index) => {
  dragOverIndex.value = index;
};
const onDragLeave = () => {
  dragOverIndex.value = null;
}
const removeComponent = (index) => {
  components.value.splice(index, 1);
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

const handleComponentClick = (component) => {
  selectedComponent.value = component;
  emit('updateSelectedComponent', component);
};

const setDroppableAreaHeight = ()=>{
  const draggableComponents = document.querySelectorAll('.draggable-component');

  draggableComponents.forEach((draggableComponent) => {
    const childComponent = draggableComponent.querySelector(':scope > *:not(.component-icons)');
    if (childComponent) {
      const childWidth = childComponent.offsetWidth;
      draggableComponent.style.width = `${childWidth}px`;
    }
  });
}
onMounted(()=>{
  components.value = props.parentComponents;
  setDroppableAreaHeight();
});
watch(components, () => {
  setDroppableAreaHeight();
  emit('updateNestedComponents', props.componentId, components.value);
}, {deep: true});
</script>
<template>
  <div class="droppable-area" @drop="onDrop" @dragover="onDragOver" ref="draggableComponents" data-drop-target="droppable">
    <div
        v-bind="attrs"
        v-for="(component, index) in components"
        :key="`${component.id}-${component.name}`"
        class="draggable-component"
        :class="{ 'drag-over': index === dragOverIndex }"
        draggable="true"
        @dragstart="onDragStart(index)"
        @dragenter="onDragEnter(index)"
        @dragleave="onDragLeave(index)"
        @drop="onDropComponent(index)"
    >
      <component :is="component.name" :componentId="component.id" v-bind="component.props"
                 :parentComponents="component.slot"
                 @@click.stop="handleComponentClick"
                 @updateNestedComponents="updateNestedComponents"
                 @updateSelectedComponent="handleComponentClick"
      />
      <div class="component-icons">
        <i class="fa-solid fa-trash-alt delete-icon component-icon" @click.stop="removeComponent(index)"/>
        <i class="fa-solid fa-pencil edit-icon component-icon" @click.stop="handleComponentClick(component)"/>
        <i class="fa-solid fa-arrows-up-down-left-right drag-icon component-icon"
           draggable="true"
           @dragstart="onDragStart(index)"
           @dragenter="onDragEnter(index)"
           @dragleave="onDragLeave(index)"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.droppable-area {
  border: 2px dashed #ccc;
  padding: 5px;
  width: 100%;
}

.draggable-component {
  min-width: 100px;
  margin: 7px;
  position: relative;
  border: 1px dotted #ccc;
}

.draggable-component.drag-over {
  border-color: #000;
}

.draggable-component:hover > .component-icons {
  display: block;
}

.component-icons{
  position: absolute;
  z-index: 999;
  border-bottom-left-radius: 3px;
  border-bottom-right-radius: 3px;
  background-color: #fff;
  padding: 0 5px;
  margin-top: -1px;
  border: 1px solid #ccc;
  display: none;
}

.component-icon{
  z-index: 3;
  margin-right: 5px;
  opacity: 0.4;
  width: 16px;
  height: 16px;
}
.component-icon:hover{
  cursor: pointer;
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.8);
}
.drag-icon {
  color: blue;
}
.delete-icon {
  color: red;
}
.edit-icon {
  color: darkcyan;
}
</style>