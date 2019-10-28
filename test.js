const deepTemplate = require('.')

test('deepTemplate(String, Object) -> String should replace ${id} mark', () => {
    const params = { id: '549873456448' }
    const template = deepTemplate('/api/users/${id}/')
    expect(template(params)).toBe("/api/users/549873456448/")
})

test('deepTemplate("${0}/${1}/${2}", Array) -> String should replace ${0}..${n} marks', () => {
    const arrayBuildPath = deepTemplate('/api/users/${0}/${1}/${2}', [null, null, 'ascending'])
    expect(arrayBuildPath(['549873456448', 'getUser'])).toBe("/api/users/549873456448/getUser/ascending")
})

test('deepTemplate(Object, Object) -> Object', () => {
    // given
    const configTemplate = {
        a: ['/api/users/${id}/${action}'],
        b: { 
            deep: {
                foo: [
                    { 
                        stuff: 'DEFAULT_ENV=${env}'
                    }
                ] 
            }
        },
        c: function() { console.log('avoided') },
        d: /keepRegExp/gim,
        e: 'keep simple texts',
        f: 10
    }
    // when
    const defaults = {action: 'defaultAction', env: '/usr/bin/bash'}
    const configBuilder = deepTemplate(clone(configTemplate), defaults)
    const builtResults = configBuilder({id: '549873456448'})
    // then
    expect(builtResults.a[0]).toBe("/api/users/549873456448/defaultAction")
    expect(builtResults.b.deep.foo[0]).toBe(configTemplate.b.deep.foo[0])
    expect(builtResults.b.deep.foo[0].stuff).toBe("DEFAULT_ENV=/usr/bin/bash")
    expect(builtResults.e).toBe(configTemplate.e)
    expect(builtResults.f).toBe(configTemplate.f)
})

function clone(obj) {
    const res = {}
    for(const prop in obj) {
        if (obj.hasOwnProperty(prop)) res[prop] = obj[prop]
    }
    return res
}