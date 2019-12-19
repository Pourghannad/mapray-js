import animation from "../animation/index";
import GeoMath from "../GeoMath";

const Time             = animation.Time;
const Interval         = animation.Interval;
const Invariance       = animation.Invariance;
const Type             = animation.Type;
const Updater          = animation.Updater;
const Binder           = animation.Binder;
const BindingBlock     = animation.BindingBlock;
const Curve            = animation.Curve;
const ConstantCurve    = animation.ConstantCurve;
const KFLinearCurve    = animation.KFLinearCurve;
const KFStepCurve      = animation.KFStepCurve;
const ComboVectorCurve = animation.ComboVectorCurve;


function
animation_tests()
{
    compare_times();
    interval_intersection();
    invariance_tests();
    invariance_single_tests();
    invariance_merge_tests();
    binder_tests();
    kflinear_curve_tests();
    kfstep_curve_tests();
    compovec_curve_tests();
    value_change_test();
    find_keyframe_tests();
}


// lessThan, lessEqual
function
compare_times()
{
    let t1 = Time.fromNumber( 123 );
    let t2 = Time.fromNumber( 567 );

    if ( !t1.lessThan( t2 ) ) {
        console.error( "time compare error" );
    }

    if ( t2.lessThan( t1 ) ) {
        console.error( "time compare error" );
    }

    if ( !t1.lessEqual( t2 ) ) {
        console.error( "time compare error" );
    }

    if ( t2.lessEqual( t1 ) ) {
        console.error( "time compare error" );
    }

    if ( !t1.lessEqual( t1 ) ) {
        console.error( "time compare error" );
    }
}


function
interval_intersection()
{
    let t1 = Time.fromNumber( 123 );
    let t2 = Time.fromNumber( 234 );
    let t3 = Time.fromNumber( 345 );
    let t4 = Time.fromNumber( 456 );

    let i1 = new Interval( t1, t3 );
    let i2 = new Interval( t2, t4 );

    let x12 = i1.getIntersection( i2 );
}


function
invariance_tests()
{
    let invr = new Invariance();

    invr.write( Interval.UNIVERSAL );
    invr.remove( Interval.UNIVERSAL );

    for ( let i = 0; i < 100; ++i ) {
        let n1 = Math.random();
        let n2 = Math.random();

        let t1 = Time.fromNumber( n1 );
        let t2 = Time.fromNumber( n1 + n2 );

        let o1 = Math.random() >= 0.5;
        let o2 = Math.random() >= 0.5;

        let ival = new Interval( t1, t2, o1, o2 );
        invr.write( ival );
    }

    invr.remove( Interval.UNIVERSAL );
}


function
invariance_single_tests()
{
    invariance_single_test1();
    invariance_single_test2();
    invariance_single_test3();
    invariance_single_test4();
}


function
invariance_single_test1()
{
    let invr = new Invariance();

    let time = Time.fromNumber( 0 );
    let ival = new Interval( time, time );

    invr.write( ival );
}


function
invariance_single_test2()
{
    let invr = new Invariance();
    invr.write( Interval.UNIVERSAL );

    let time = Time.fromNumber( 0 );
    let ival = new Interval( time, time );

    invr.remove( ival );
}


function
invariance_single_test3()
{
    let invr = new Invariance();
    invr.write( Interval.UNIVERSAL );

    let ival = new Interval( Time.MIN_TIME, Time.MIN_TIME );

    invr.remove( ival );
}


function
invariance_single_test4()
{
    let invr = new Invariance();
    invr.write( Interval.UNIVERSAL );

    let ival = new Interval( Time.MAX_TIME, Time.MAX_TIME );

    invr.remove( ival );
}


function
invariance_merge_tests()
{
    invariance_merge_test1();
    invariance_merge_test2();
}


function
invariance_merge_test1()
{
    for ( let c = 0; c < 10; ++c ) {
        let invrs = [];

        for ( let i = 0; i < c; ++i ) {
            let invr = new Invariance();

            let n1 = Math.random();
            let n2 = Math.random();

            let ival = createClosedInterval( n1, n1 + n2 );

            invr.write( ival );

            invrs.push( invr );
        }

        let merged = Invariance.merge( invrs );
    }
}


function
invariance_merge_test2()
{
    let invr1 = new Invariance();
    let ival1 = createClosedInterval( 1, 3 );
    invr1.write( ival1 );

    let invr2 = new Invariance();
    let ival2 = createClosedInterval( 2, 4 );
    invr2.write( ival2 );

    let merged = Invariance.merge( [invr1, invr2] );
}


function
createClosedInterval( nlower, nupper )
{
    let lower = Time.fromNumber( nlower );
    let upper = Time.fromNumber( nupper );

    return new Interval( lower, upper );
}


function
binder_tests()
{
    const const_value = 123;

    let parameter;

    let updater = new Updater();

    let type = Type.find( "number" );

    let curve = new ConstantCurve( type );
    curve.setConstantValue( const_value );

    let binder = new Binder( updater, curve, type, v => { parameter = v; } );

    updater.update( Time.fromNumber( 0 ) );

    if ( parameter != const_value ) {
        console.error( "update error" );
    }

    binder.unbind();
}


function
kflinear_curve_tests()
{
    let parameter;

    let updater = new Updater();

    let type = Type.find( "vector3" );

    let curve = new KFLinearCurve( type );

    let keyframes = [];
    for ( let t = 0; t <= 100; ++t ) {
        keyframes.push( Time.fromNumber( t ) );
        keyframes.push( GeoMath.createVector3( [t, 2*t, 3*t] ) );
    }
    curve.setKeyFrames( keyframes );

    let binder = new Binder( updater, curve, type, v => { parameter = v; } );

    updater.update( Time.fromNumber( 50 ) );

    if ( parameter == null ) {
        console.error( "update error" );
    }

    binder.unbind();
}


function
kfstep_curve_tests()
{
    let parameter;

    let updater = new Updater();

    let type = Type.find( "vector3" );

    let keyframes = [];
    for ( let t = 0; t <= 100; ++t ) {
        keyframes.push( Time.fromNumber( t ) );
        keyframes.push( GeoMath.createVector3( [t, 2*t, 3*t] ) );
    }

    let curve = new KFStepCurve( type, keyframes );

    let binder = new Binder( updater, curve, type, v => { parameter = v; } );

    updater.update( Time.fromNumber( 200 ) );

    if ( parameter == null ) {
        console.error( "update error" );
    }

    binder.unbind();
}


function
compovec_curve_tests()
{
    let parameter;

    let updater = new Updater();

    let type = Type.find( "vector3" );

    let curve = new ComboVectorCurve( type );

    for ( let i = 0; i < 3; ++i ) {
        let child = new ConstantCurve( Type.find( "number" ) );
        child.setConstantValue( i + 1 );
        curve.setChild( i, child );
    }

    let binder = new Binder( updater, curve, type, v => { parameter = v; } );

    updater.update( Time.fromNumber( 50 ) );

    if ( parameter == null ) {
        console.error( "update error" );
    }

    binder.unbind();
}


function
value_change_test()
{
    let parameter;

    let type = Type.find( "number" );

    let invr  = new Invariance();
    invr.write( new Interval( Time.fromNumber( 0 ), Time.fromNumber( 1 ), true, true ).getPrecedings() );
    invr.write( new Interval( Time.fromNumber( 0 ), Time.fromNumber( 1 ), true, true ).getFollowings() );

    let updater = new Updater();
    let   curve = new ValueChangeCurve( invr );
    let  binder = new Binder( updater, curve, type, v => { parameter = v; } );

    updater.update( Time.fromNumber( -1 ) );

    curve.changeValue( new Interval( Time.fromNumber( -0.1 ), Time.fromNumber( 1.1 ), false, false ),
                       invr );

    binder.unbind();
}


function
find_keyframe_tests()
{
    for ( let j = 1; j <= 50; ++j ) {
        let array = new Array( j );
        for ( let i = 0; i < j; ++i ) {
            array[i] = i;
        }

        for ( let i = 0; i < array.length; ++i ) {
            let it = findKeyFrameIndex( i, array, 0, array.length );
            if ( it != i + 1 ) {
                console.error( "findKeyFrameIndex error" );
            }
        }

        if ( findKeyFrameIndex( -1, array, 0, array.length ) != 0 ) {
            console.error( "findKeyFrameIndex error" );
        }

        if ( findKeyFrameIndex( array.length, array, 0, array.length ) != array.length ) {
            console.error( "findKeyFrameIndex error" );
        }
    }
}


function
findKeyFrameIndex( time, key_times, lower, upper )
{
    let l_idx = lower;
    let u_idx = upper;

    for (;;) {
        if ( u_idx - l_idx >= 2 ) {
            let m_idx  = Math.floor( (l_idx + u_idx) / 2 );  // 中間インデックス
            let m_time = key_times[m_idx];

            if ( m_time <  time ) {
                // m_time < time なので [m_idx, u_idx) に存在するかもしれない
                l_idx = m_idx;
            }
            else if ( time < m_time ) {
                // m_time > time なので [l_idx, m_idx) を確認
                u_idx = m_idx;
            }
            else {
                // m_time == time なので m_idx の次が結果になる
                return m_idx + 1;
            }
        }
        else {
            // u_idx - l_idx == 1
            let l_time = key_times[l_idx];
            return time < l_time ? l_idx : u_idx;
        }
    }

    return 0; // 警告回避
}


/**
 * テスト用関数
 */
class ValueChangeCurve extends Curve
{
    /**
     */
    constructor( invariance )
    {
        super();
        this._invariance = invariance.clone();
    }

    /**
     */
    changeValue( interval, invariance )
    {
        this._invariance = invariance.clone();
        this.notifyValueChange( interval );
    }

    /**
     * @override
     */
    isTypeSupported( type )
    {
        return true;
    }

    /**
     * @override
     */
    getValue( time, type )
    {
        return type.getDefaultValue();
    }

    /**
     * @override
     */
    getInvariance( interval )
    {
        return this._invariance.getNarrowed( interval );
    }

}


export default animation_tests;
