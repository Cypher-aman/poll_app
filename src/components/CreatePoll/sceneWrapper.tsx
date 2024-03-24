import React from "react";

const SceneWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <div className="space-y-5">
      <h3 className="font-Montserrat text-3xl font-semibold">{title}</h3>
      {children}
    </div>
  );
};

export default SceneWrapper;
