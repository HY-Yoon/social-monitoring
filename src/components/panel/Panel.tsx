type PanelProps = {
  title: string;
  children: React.ReactNode;
};

const Panel = ({ title, children }: PanelProps) => {
  return (
    <div className="mt-4 flex flex-col gap-2 px-2">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Panel;
