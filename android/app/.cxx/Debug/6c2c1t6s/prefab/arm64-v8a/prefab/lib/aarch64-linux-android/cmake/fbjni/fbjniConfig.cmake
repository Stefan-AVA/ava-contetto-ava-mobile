if(NOT TARGET fbjni::fbjni)
add_library(fbjni::fbjni SHARED IMPORTED)
set_target_properties(fbjni::fbjni PROPERTIES
    IMPORTED_LOCATION "/Users/yumartins/.gradle/caches/transforms-3/8a903d94575e1c09dbe08de025b9dc07/transformed/jetified-fbjni-0.5.1/prefab/modules/fbjni/libs/android.arm64-v8a/libfbjni.so"
    INTERFACE_INCLUDE_DIRECTORIES "/Users/yumartins/.gradle/caches/transforms-3/8a903d94575e1c09dbe08de025b9dc07/transformed/jetified-fbjni-0.5.1/prefab/modules/fbjni/include"
    INTERFACE_LINK_LIBRARIES ""
)
endif()

