
type PanelProps = {
    title: string;
    children: React.ReactNode;
};

const Panel = ({title, children}: PanelProps) => {
    return (
        <div className="panel">
            <h2>{title}</h2>
            <div className="panel-content">
                {children}
            </div>
        </div>
    )
}

export default Panel;