import React from "react";

const AuthSuccess: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="!w-full col-span-2 text-green-500 text-center py-5 rounded-lg bg-green-100 mb-5">
      <p>{message}</p>
    </div>
  );
};

export default AuthSuccess;
