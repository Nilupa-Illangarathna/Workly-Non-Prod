import React from "react";

const AuthError: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div className="!w-full col-span-2 text-red-500 text-center py-5 rounded-lg bg-red-100 my-5">
      <p>{message}</p>
    </div>
  );
};

export default AuthError;
