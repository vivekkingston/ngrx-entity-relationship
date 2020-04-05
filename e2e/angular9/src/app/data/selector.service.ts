import {Injectable} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {childrenEntities, relatedEntity, relationships, rootEntities, rootEntity} from 'ngrx-entity-relationship';
import {map, switchMap} from 'rxjs/operators';
import {DataHeroService} from './data-hero.service';
import {DataVillainService} from './data-villain.service';

@Injectable({providedIn: 'root'})
export class SelectorService {
    constructor(
        protected readonly hero: DataHeroService,
        protected readonly villain: DataVillainService,
        protected readonly store: Store<unknown>,
    ) {}

    public readonly selectHeroesWithVillainShort = rootEntities(
        rootEntity(this.hero, relatedEntity(this.villain, 'villainId', 'villain')),
    );

    public readonly selectHeroWithVillainShort = rootEntity(
        this.hero,
        relatedEntity(this.villain, 'villainId', 'villain'),
    );

    public readonly selectVillainWithHeroShort = rootEntities(
        rootEntity(this.villain, childrenEntities(this.hero, 'villainId', 'heroes')),
    );

    public readonly heroesWithVillain$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectHeroesWithVillainShort, ids)),
    );

    public readonly heroWithVillainId$ = this.store.pipe(
        select(this.hero.selectors.selectKeys),
        switchMap(() => this.store.select(this.selectHeroWithVillainShort, '12')),
    );

    public readonly heroesWithVillainShort$ = this.hero.entities$.pipe(
        relationships(this.store, this.selectHeroesWithVillainShort),
    );

    public readonly heroesWithVillainShortId$ = this.hero.entities$.pipe(
        map(v => v.shift()),
        relationships(this.store, this.selectHeroWithVillainShort),
    );

    public readonly villainsWithHeroes$ = this.store.pipe(
        select(this.villain.selectors.selectKeys),
        switchMap(ids => this.store.select(this.selectVillainWithHeroShort, ids)),
    );

    public readonly villainsWithHeroesShort$ = this.villain.entities$.pipe(
        relationships(this.store, this.selectVillainWithHeroShort),
    );
}