import { Icon } from "@iconify/vue";
import { isArray } from "lodash-es";
import { withModifiers } from "vue";

export interface ImagePreviewOptions {
  images: string[];
  startPosition?: number;
}

const state = reactive({
  show: false,
});

let unmount: () => void;

const ImagePreview = defineComponent(
  (props: ImagePreviewOptions) => {
    const { images } = toRefs(props);
    const position = ref(props.startPosition || 0);
    const zoom = ref(0);
    const currentImage = computed(() => images.value[position.value]);

    function unsetZoom() {
      zoom.value = 0;
      setTimeout(() => {
        zoom.value = 1;
      }, 100);
    }
    const handleBack = () => {
      if (images.value.length > 1 && position.value !== 0) {
        position.value -= 1;
      }
    };
    const handleNext = () => {
      if (images.value.length > 1 && position.value !== images.value.length - 1) {
        position.value += 1;
      }
    };
    async function handleDownload() {
      const data = await useImageToBinary(currentImage.value);
      await useWriteBinaryFile(data, currentImage.value);
    }

    useEventListener("keydown", (event) => {
      switch (event.key) {
        case "Escape":
          state.show = false;
          break;
        case "ArrowRight":
          handleNext();
          break;
        case "ArrowLeft":
          handleBack();
          break;
      }
    });

    watch(
      position,
      () => {
        unsetZoom();
      },
      { immediate: true },
    );

    watch(
      () => state.show,
      (v) => {
        v === false && unmount && unmount();
      },
    );

    return () => (
      <div
        class="absolute top-0 left-0 w-screen h-screen bg-#29292952 flex items-center justify-center overflow-hidden"
        onClick={withModifiers(() => (state.show = false), ["self"])}
      >
        <div
          class="h-full flex items-center justify-center"
          onClick={withModifiers(() => (state.show = false), ["self"])}
        >
          <img
            src={currentImage.value}
            class={["h-50%", "object-cover", "transition-all", "duration-500", "ease-in-out"]}
            style={{ transform: `scale(${zoom.value})` }}
          />
        </div>

        <div class="absolute bottom-40px right-20px h-48px px-10px bg-#00000059 rounded-10px color-#e6e6e6 flex items-center">
          <Icon
            icon="typcn:zoom-in"
            class="w-24px h-24px mr-10px cursor-pointer"
            onClick={() => {
              if (zoom.value <= 4) zoom.value += 0.5;
            }}
          />
          <Icon
            icon="typcn:zoom-out"
            class="w-24px h-24px mr-10px cursor-pointer"
            onClick={() => {
              if (zoom.value > 0.5) zoom.value -= 0.5;
            }}
          />
          <Icon icon="ion:chevron-back" class="w-24px h-24px mr-10px cursor-pointer" onClick={() => handleBack()} />
          <Icon
            icon="ion:ios-arrow-forward"
            class="w-24px h-24px mr-10px cursor-pointer"
            onClick={() => handleNext()}
          />
          <Icon
            icon="ic:baseline-arrow-downward"
            class="w-24px h-24px mr-10px cursor-pointer"
            onClick={() => handleDownload()}
          />
          <Icon icon="mdi:close" class="w-24px h-24px cursor-pointer" onClick={() => (state.show = false)} />
        </div>
      </div>
    );
  },
  {
    props: {
      images: {
        type: Array,
        default: () => [],
      },
      startPosition: {
        type: Number,
        default: 0,
      },
    },
  },
);

function showImagePreview(option: string[] | ImagePreviewOptions) {
  const component = mountComponent({
    setup() {
      const images = isArray(option) ? option : option.images;
      const _options: ImagePreviewOptions = {
        images,
        startPosition: isArray(option) ? 0 : option.startPosition,
      };
      state.show = true;
      return () => <ImagePreview {..._options} />;
    },
  });

  unmount = component.unmount;

  return component.instance;
}

function mountComponent(Root: Component) {
  const app = createApp(Root);
  const root = document.createElement("div");

  document.body.appendChild(root);

  return {
    instance: app.mount(root),
    unmount() {
      app.unmount();
      document.body.removeChild(root);
    },
  };
}

export { showImagePreview };

export default ImagePreview;
