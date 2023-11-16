export interface Watermark {
  text: string;
  top: number;
  left: number;
  size: number;
  fontColor: string;
  backgroundColor: string;
  opacity: number;
}

export const useWatermarkState = createGlobalState(() => {
  const [form, reset] = useResetRef<Watermark>({
    text: "PICX",
    top: 0,
    left: 0,
    size: 16,
    fontColor: "#ffffff",
    backgroundColor: "#ffffff",
    opacity: 0.2,
  });
  const watermark = useStorage<Watermark>(
    "picx-watermark",
    form,
    localStorage,
    {
      serializer: {
        read: (v) => (v ? JSON.parse(v) : null),
        write: (v) => JSON.stringify(v),
      },
    }
  );

  return {
    watermark,
  };
});
