import { Metadata } from "next";
import React, { FC } from "react";

interface IProps {
  params: Promise<{ id: string }>;
}

/**
 * @author
 * @function @DynamicMetaData
 **/

export const generateMetadata = async ({
  params,
}: IProps): Promise<Metadata> => {
  const id = (await params).id;
  return {
    title: `Dynamic Meta Data ${id}`,
  };
};

const DynamicMetaData: FC<IProps> = async ({ params }: IProps) => {
  const id = (await params).id;
  return <div>DynamicMetaData {id}</div>;
};

export default DynamicMetaData;
