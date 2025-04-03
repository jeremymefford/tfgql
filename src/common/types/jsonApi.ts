/**
 * Generic types modeling Terraform Enterprise API JSON:API responses.
 */

export interface ResourceObject<Attributes> {
  id: string;
  type: string;
  attributes: Attributes;
  // Note: relationships can be added in extending interfaces if needed
}

export interface ResourceRef {
  id: string;
  type: string;
}

export interface ListResponse<Resource> {
  data: Resource[];
  // (Pagination metadata omitted for brevity)
}

export interface SingleResponse<Resource> {
  data: Resource;
}