const ProcessingLogo = ({ text }: { text: string }) => {
  return (
    <div className="absolute left-1/2 top-1/2 ml-[-50px] mt-[-10px] text-center font-bold font-[Arial]">
      <span className="block bg-muted-foreground w-full h-[7px] mt-[7px] rounded-[5px] animate-processing-bar" />
      <span className="block bg-muted-foreground w-full h-[7px] mt-[7px] rounded-[5px] animate-processing-bar-100" />
      <span className="block bg-muted-foreground w-full h-[7px] mt-[7px] rounded-[5px] animate-processing-bar-200" />
      <p className="w-full text-xl text-muted-foreground">{text}</p>
    </div>
  );
};

type ProcessingType = {
  modaless?: boolean;
  text: string;
};

const Processing = ({ modaless, text }: ProcessingType) => {
  if (modaless) {
    return <ProcessingLogo text={text} />;
  }
  return (
    <div className="fixed top-0 left-0 z-[9999] flex h-screen w-screen items-center justify-center bg-white/40">
      <ProcessingLogo text={text} />
    </div>
  );
};

export const Loading = ({ modaless }: { modaless?: boolean }) => (
  <Processing text="LOADING..." modaless={modaless} />
);

export const Updating = ({ modaless }: { modaless?: boolean }) => (
  <Processing text="UPDATE..." modaless={modaless} />
);
