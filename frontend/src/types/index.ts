export interface NFT {
  owner: string;
  id: number;
  isOwned: boolean;
  onSale: boolean;
  price: null | number;
  metadataUri: string;
}

export interface MintParams {
  operator: string;
  address: string;
  price: number;
  metadataUri: string;
}

export interface AddRoleData {
  add_role: UserRoleMapping;
}

export interface RemoveRoleData {
  remove_role: UserRoleMapping;
}

interface UserRoleMapping {
  user: string;
  role: Role;
}
interface Role {
  provider?: boolean;
  consumer?: boolean;
}

export interface Alert {
  id: number;
  message: string;
  type: "info" | "warning" | "success" | "error";
  visible: boolean;
}

interface Sensor {
  fileName: string;
  fileSize: number;
  mimeType: string;
  ontologyUri: string | null;
}

interface Format {
  uri: string;
  hash: string;
  mimeType: string;
}

export interface TokenMetadata {
  name: string;
  description: string;
  tags: Array<string>;
  files: Array<Sensor>;
  formats: Array<Format>;
  artifactUri: string;
}
