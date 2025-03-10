export const Button: React.FunctionComponent<
    React.PropsWithChildren<{ onClick: () => void; primary?: boolean }>
> = props => (
    <a
        className={`button ${props.primary ? "button--primary" : ""}`}
        href="#"
        onClick={props.onClick}
    >
        {props.children}
    </a>
);

export const GrayBox: React.FunctionComponent<React.PropsWithChildren<{}>> = props => (
    <div className="background-color--grey--1 spaced--tight padded--tight">
        {props.children}
    </div>
);

export const Centered: React.FunctionComponent<React.PropsWithChildren<{}>> = props => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div>{props.children}</div>
    </div>
);
