import { Component } from '@angular/core';
import {ActivatedRoute,Router} from '@angular/router'; //activar navegacion de paginas por medio de parametros y por boton 
import { IProduct } from '../_model/product';

@Component({ /* no podemos selector porque no lo sera un componente nested, sino que será una nueva pagina a mostrar por medio de enrutamiento*/
    templateUrl:'./product-detail.component.html',
    styleUrls:['./product-detail.component.css']
})
export class ProductDetailComponent {
    pageTitle: string = 'Product Detail';
    product: IProduct;

    constructor(private  route:ActivatedRoute, private router:Router){}

    ngOnInit(){
        let id =+this.route.snapshot.paramMap.get('id');
        this.pageTitle += `: ${id}`;
        this.product = {
            'productId': id,
            'productName': 'Leaf Rake',
            'productCode': 'GDN-0011',
            'releaseDate': 'March 19, 2019',
            'description': 'Leaf rake wit 48 inch',
            'price': 19.95,
            'starRating': 3.2,
            'imageUrl':'assets/images/leaf_rake.png'
        }
    }

    onBack(): void{
        this.router.navigate(['/products']);
    }
}