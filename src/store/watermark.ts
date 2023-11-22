export interface Watermark {
  enable: boolean;
  text: string;
  top: number;
  left: number;
  size: number;
  fontColor: string;
}

export const useWatermarkState = createGlobalState(() => {
  const [form, reset] = useResetRef<Watermark>({
    enable: false,
    text: "Hello Picx",
    top: 10,
    left: 10,
    size: 30,
    fontColor: "#F4FAFFFF",
  });
  const watermark = useStorage<Watermark>("picx-watermark", form, localStorage, {
    serializer: {
      read: (v) => (v ? JSON.parse(v) : null),
      write: (v) => JSON.stringify(v),
    },
  });

  return {
    watermark,
  };
});
