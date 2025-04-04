/****
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

export interface Links {
  first?: string;
  last?: string;
  next?: string | null;
  prev?: string | null;
  self?: string;
}

export interface PaginationMeta {
  'current-page': number;
  'next-page': number | null;
  'page-size': number;
  'prev-page': number | null;
  'total-count': number;
  'total-pages': number;
}

export interface Meta {
  pagination?: PaginationMeta;
}

export interface ListResponse<Resource> {
  data: Resource[];
  meta?: Meta;
  links?: Links;
}

export interface SingleResponse<Resource> {
  data: Resource;
}