import React from "react";

// const NodeWarpper = (Component: React.FC) => {
//     return (props: any) => {
//         const { node, ...rest } = props;
//         const componentProps = node?.getData();
//         const memoizedData = useMemo(() => node.getData(), [node]);
//         console.log("componentProps", componentProps)
//         const MemoizedComponent = React.memo(Component);
//         return <MemoizedComponent {...memoizedData} {...rest} node={node} isDrag={true} />;
//     };
// }

// export {NodeWarpper};


// const NodeWarpper = ({children,...props}) => {
//    return <Component></Component>
// }

// export {NodeWarpper};


const NodeWarpper = (Component: React.FC) => {
    return (props: any) => {
        return <Component {...props} isDrag={true} />;
    };
}

export {NodeWarpper};
