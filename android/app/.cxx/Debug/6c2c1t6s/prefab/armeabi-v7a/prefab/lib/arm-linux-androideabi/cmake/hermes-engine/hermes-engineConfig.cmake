if(NOT TARGET hermes-engine::libhermes)
add_library(hermes-engine::libhermes SHARED IMPORTED)
set_target_properties(hermes-engine::libhermes PROPERTIES
    IMPORTED_LOCATION "/Users/yumartins/.gradle/caches/transforms-3/890ae82d70aa11c9d49dff8be248f2f9/transformed/jetified-hermes-android-0.73.4-debug/prefab/modules/libhermes/libs/android.armeabi-v7a/libhermes.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/yumartins/.gradle/caches/transforms-3/890ae82d70aa11c9d49dff8be248f2f9/transformed/jetified-hermes-android-0.73.4-debug/prefab/modules/libhermes/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

