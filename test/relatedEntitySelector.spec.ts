import {HANDLER_RELATED_ENTITY, relatedEntitySelector} from 'ngrx-entity-relationship';

describe('relatedEntitySelector', () => {
    type Entity = {
        id: string;
        name: string;
        parent?: Entity;
        parentId?: string;
        children?: Array<Entity>;
    };

    it('marks callback with ngrxEntityRelationship key', () => {
        const actual = relatedEntitySelector<any, any, any, any, any>(jasmine.createSpy(), '', '');
        expect(actual).toEqual(jasmine.any(Function));
        expect(actual).toEqual(
            jasmine.objectContaining({
                ngrxEntityRelationship: 'relatedEntitySelector',
            }),
        );
    });

    it('calls relatedEntity with relations', () => {
        const state = {
            feature: {
                ids: [],
                entities: {},
            },
        };

        const rel1: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel1');
        rel1.ngrxEntityRelationship = 'spy';
        rel1.and.callFake((_1, _2, _3, v) => (v.rel1 = true));

        const rel2: HANDLER_RELATED_ENTITY<typeof state, Entity> & jasmine.Spy = <any>jasmine.createSpy('rel2');
        rel2.ngrxEntityRelationship = 'spy';
        rel2.and.callFake((_1, _2, _3, v) => (v.rel2 = true));

        const entitySelector = relatedEntitySelector<typeof state, Entity, Entity, 'parentId', 'parent'>(
            v => v.feature,
            'parentId',
            'parent',
        );

        const selector = entitySelector(rel1, rel2);

        const entity: Entity = {
            id: 'id1',
            name: 'name1',
            parentId: 'id2',
        };
        state.feature.entities = {
            ...state.feature.entities,
            id2: {
                id: 'id2',
                name: 'name2',
            },
        };
        selector('randRelatedEntitySelector', state, new Map(), entity, selector.idSelector);
        expect(entity.parent).toEqual(
            jasmine.objectContaining({
                rel1: true,
                rel2: true,
            } as any),
        );
    });
});
