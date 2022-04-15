import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map, Observable} from "rxjs";
import {Product} from "../common/product";
import { ProductCategory } from '../common/product-category';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:9090/api/products';
  private categoryUrl = 'http://localhost:9090/api/product-category'

  constructor(private httpClient: HttpClient) {
  }

  getProductList(theCategoryId: number): Observable<Product[]> {

    // need to build URL based on category id
    const searchURL = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.httpClient.get<GetResponseProducts>(searchURL).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }
}

interface GetResponseProducts {
  _embedded: {
    products: Product[];
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
